const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

/**
 * Factory — returns a configured multer instance that streams directly to Cloudinary.
 *
 * @param {string} folder  - Cloudinary folder path, e.g. 'incident-management/reports'
 * @param {number} maxMB   - Max file size in megabytes (default 10 MB)
 * @returns multer middleware
 */
const createUploadMiddleware = (folder = 'incident-management', maxMB = 10) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder,
      // Deliver as webp for images; keep original for video/docs
      format: file.mimetype.startsWith('image/') ? 'webp' : undefined,
      // Quality-based compression for images
      transformation: file.mimetype.startsWith('image/')
        ? [
            { width: 1920, height: 1080, crop: 'limit' }, // cap resolution
            { quality: 'auto:good' },                      // Cloudinary smart compression
            { fetch_format: 'auto' },                      // serve best format per browser
          ]
        : undefined,
      // Organised, readable public_id — folder/userId_timestamp
      public_id: `${folder.split('/').pop()}_${req.user?.uid || 'anon'}_${Date.now()}`,
    }),
  });

  const fileFilter = (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/quicktime', 'video/x-msvideo',
      'application/pdf',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
  };

  return multer({
    storage,
    limits: { fileSize: maxMB * 1024 * 1024 },
    fileFilter,
  });
};

// Pre-built instances for each upload context
const incidentUpload  = createUploadMiddleware('incident-management/incidents', 15);
const checklistUpload = createUploadMiddleware('incident-management/checklists', 10);
const supervisorUpload = createUploadMiddleware('supervisor/reports', 10);

module.exports = { createUploadMiddleware, incidentUpload, checklistUpload, supervisorUpload };
