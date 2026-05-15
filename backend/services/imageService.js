const { cloudinary } = require('../config/cloudinary');
const IncidentImage = require('../models/IncidentImage');

/**
 * Centralized image service — handles all Cloudinary + MongoDB operations.
 * All methods use async/await with structured error handling.
 */

/**
 * Persist metadata for a successfully uploaded file.
 * Called after multer-storage-cloudinary has already uploaded the file.
 *
 * @param {object} file       - multer file object (populated by multer-storage-cloudinary)
 * @param {object} metadata   - additional context fields
 * @returns {Promise<IncidentImage>}
 */
const saveImageMetadata = async (file, metadata = {}) => {
  const doc = new IncidentImage({
    incidentId:      metadata.incidentId      || null,
    reportId:        metadata.reportId        || null,
    checklistItemId: metadata.checklistItemId || null,
    shiftId:         metadata.shiftId         || null,
    spotId:          metadata.spotId          || null,
    uploadedBy:      metadata.uploadedBy,
    uploaderPhone:   metadata.uploaderPhone   || null,
    uploadContext:   metadata.uploadContext   || 'other',

    // Populated by Cloudinary via multer-storage-cloudinary
    imageUrl:      file.path,           // secure_url from Cloudinary
    publicId:      file.filename,       // public_id from Cloudinary
    resourceType:  file.resource_type || 'image',
    mimeType:      file.mimetype,
    size:          file.size,
    width:         file.width           || null,
    height:        file.height          || null,
    format:        file.format          || null,
  });

  await doc.save();
  return doc;
};

/**
 * Retrieve all images for a given incidentId.
 * Redis-ready: cache key would be `incident:images:{incidentId}`
 *
 * @param {string} incidentId
 * @returns {Promise<IncidentImage[]>}
 */
const getImagesByIncident = async (incidentId) => {
  return IncidentImage
    .find({ incidentId })
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Retrieve all images for a given reportId.
 * Redis-ready: cache key would be `report:images:{reportId}`
 *
 * @param {string} reportId
 * @param {string} [context]  - optional uploadContext filter
 * @returns {Promise<IncidentImage[]>}
 */
const getImagesByReport = async (reportId, context = null) => {
  const query = { reportId };
  if (context) query.uploadContext = context;
  return IncidentImage
    .find(query)
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Retrieve all images uploaded by a specific user.
 *
 * @param {string} userId   - Firebase UID
 * @param {number} limit
 * @returns {Promise<IncidentImage[]>}
 */
const getImagesByUser = async (userId, limit = 50) => {
  return IncidentImage
    .find({ uploadedBy: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

/**
 * Delete an image from Cloudinary AND remove its metadata from MongoDB.
 * Auth-guarded: caller should verify ownership before calling.
 *
 * @param {string} publicId       - Cloudinary public_id
 * @param {string} resourceType   - 'image' | 'video' | 'raw'
 * @returns {Promise<{cloudinary: object, mongo: object}>}
 */
const deleteImage = async (publicId, resourceType = 'image') => {
  // 1. Remove from Cloudinary
  const cloudResult = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });

  // 2. Remove metadata from MongoDB
  const mongoResult = await IncidentImage.deleteOne({ publicId });

  return { cloudinary: cloudResult, mongo: mongoResult };
};

/**
 * Generate a signed URL for secure private delivery (optional advanced usage).
 *
 * @param {string} publicId
 * @param {object} opts
 * @returns {string} signed URL
 */
const getSignedUrl = (publicId, opts = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    type: 'authenticated',
    ...opts,
  });
};

module.exports = {
  saveImageMetadata,
  getImagesByIncident,
  getImagesByReport,
  getImagesByUser,
  deleteImage,
  getSignedUrl,
};
