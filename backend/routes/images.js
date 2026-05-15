const express = require('express');
const router = express.Router();
const { verifyToken } = require('../config/firebase');
const { incidentUpload, checklistUpload, supervisorUpload } = require('../middleware/upload');
const {
  saveImageMetadata,
  getImagesByIncident,
  getImagesByReport,
  getImagesByUser,
  deleteImage,
} = require('../services/imageService');

// ─── Centralised error handler ────────────────────────────────────────────────
const handleUploadError = (err, res) => {
  console.error('[ImageRoute] Error:', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, error: 'File too large. Maximum size exceeded.' });
  }
  if (err.message?.includes('Unsupported file type')) {
    return res.status(415).json({ success: false, error: err.message });
  }
  if (err.http_code === 401 || err.message?.includes('credentials')) {
    return res.status(500).json({ success: false, error: 'Cloudinary not configured. Check server .env.' });
  }
  return res.status(500).json({ success: false, error: err.message || 'Upload failed.' });
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/images/occurrence
// Upload 1–5 evidence images for an occurrence (incident report).
// ─────────────────────────────────────────────────────────────────────────────
router.post('/occurrence', verifyToken, (req, res) => {
  incidentUpload.array('images', 5)(req, res, async (err) => {
    if (err) return handleUploadError(err, res);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded.' });
    }

    try {
      const { incidentId, shiftId, spotId } = req.body;

      const savedDocs = await Promise.all(
        req.files.map((file) =>
          saveImageMetadata(file, {
            incidentId:    incidentId    || null,
            shiftId:       shiftId       || null,
            spotId:        spotId        || null,
            uploadedBy:    req.user.uid,
            uploaderPhone: req.user.phone_number || null,
            uploadContext: 'occurrence_evidence',
          })
        )
      );

      console.log(`[MongoDB] Saved metadata for ${savedDocs.length} images (context: occurrence_evidence)`);
      return res.status(201).json({
        success: true,
        message: `${savedDocs.length} image(s) uploaded successfully.`,
        images: savedDocs.map((d) => ({
          id:        d._id,
          imageUrl:  d.imageUrl,
          publicId:  d.publicId,
          mimeType:  d.mimeType,
          size:      d.size,
          createdAt: d.createdAt,
        })),
      });
    } catch (e) {
      return handleUploadError(e, res);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/images/checklist
// Upload a single evidence photo for a specific checklist "No" answer.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/checklist', verifyToken, (req, res) => {
  checklistUpload.single('image')(req, res, async (err) => {
    if (err) return handleUploadError(err, res);
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    try {
      const { reportId, shiftId, spotId, checklistItemId } = req.body;

      const doc = await saveImageMetadata(req.file, {
        reportId:        reportId        || null,
        shiftId:         shiftId         || null,
        spotId:          spotId          || null,
        checklistItemId: checklistItemId ? Number(checklistItemId) : null,
        uploadedBy:      req.user.uid,
        uploaderPhone:   req.user.phone_number || null,
        uploadContext:   'checklist_evidence',
      });

      console.log(`[MongoDB] Saved metadata for checklist evidence (publicId: ${doc.publicId})`);
      return res.status(201).json({
        success:  true,
        message:  'Checklist evidence uploaded.',
        image: {
          id:        doc._id,
          imageUrl:  doc.imageUrl,
          publicId:  doc.publicId,
          mimeType:  doc.mimeType,
          size:      doc.size,
          createdAt: doc.createdAt,
        },
      });
    } catch (e) {
      return handleUploadError(e, res);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/images/report
// Upload up to 10 images for an end-of-shift report package.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/report', verifyToken, (req, res) => {
  supervisorUpload.array('images', 10)(req, res, async (err) => {
    if (err) return handleUploadError(err, res);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded.' });
    }

    try {
      const { reportId, shiftId } = req.body;

      const savedDocs = await Promise.all(
        req.files.map((file) =>
          saveImageMetadata(file, {
            reportId:      reportId  || null,
            shiftId:       shiftId   || null,
            uploadedBy:    req.user.uid,
            uploaderPhone: req.user.phone_number || null,
            uploadContext: 'patrol_report',
          })
        )
      );

      console.log(`[MongoDB] Saved metadata for ${savedDocs.length} report images`);
      return res.status(201).json({
        success: true,
        message: `${savedDocs.length} report image(s) uploaded.`,
        images: savedDocs.map((d) => ({
          id:        d._id,
          imageUrl:  d.imageUrl,
          publicId:  d.publicId,
          mimeType:  d.mimeType,
          size:      d.size,
          createdAt: d.createdAt,
        })),
      });
    } catch (e) {
      return handleUploadError(e, res);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/images/incident/:incidentId
// Retrieve all images for a given SQL occurrence id.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/incident/:incidentId', verifyToken, async (req, res) => {
  try {
    const images = await getImagesByIncident(req.params.incidentId);
    return res.json({ success: true, count: images.length, images });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/images/report/:reportId
// Retrieve all images for a patrol report.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/report/:reportId', verifyToken, async (req, res) => {
  try {
    const images = await getImagesByReport(req.params.reportId, req.query.context || null);
    return res.json({ success: true, count: images.length, images });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/images/my
// Retrieve images uploaded by the authenticated supervisor.
// Redis-ready: cache key `user:images:{uid}`
// ─────────────────────────────────────────────────────────────────────────────
router.get('/my', verifyToken, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const images = await getImagesByUser(req.user.uid, limit);
    return res.json({ success: true, count: images.length, images });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/images/:publicId
// Delete from Cloudinary + remove MongoDB metadata.
// Auth-guarded: only the uploader can delete their own images.
// ─────────────────────────────────────────────────────────────────────────────
// Express v5 / path-to-regexp v8 compatible delete — publicId extracted from req.path
router.delete('/:segment', verifyToken, async (req, res) => {
  try {
    // publicId can contain slashes (e.g. "incident-management/incidents/file_123")
    // We reconstruct it from the full path after the /api/images/ prefix
    const rawPath = req.originalUrl.replace(/^\/api\/images\//, '').split('?')[0];
    const publicId = decodeURIComponent(rawPath);

    const IncidentImage = require('../models/IncidentImage');
    const existing = await IncidentImage.findOne({ publicId });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Image not found.' });
    }
    if (existing.uploadedBy !== req.user.uid) {
      return res.status(403).json({ success: false, error: 'Forbidden: not your image.' });
    }

    const result = await deleteImage(publicId, existing.resourceType);
    return res.json({ success: true, message: 'Image deleted.', detail: result });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
