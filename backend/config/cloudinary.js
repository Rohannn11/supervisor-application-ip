const cloudinary = require('cloudinary').v2;

/**
 * Configures and validates Cloudinary credentials at server startup.
 * Exported instance is used by both the upload middleware and the service layer.
 */
const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn(
      '[Cloudinary] ⚠️  Credentials not set in .env — image uploads will fail.\n' +
      '             Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.'
    );
    return false;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key:    CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure:     true,   // always use HTTPS URLs
  });

  console.log(`[Cloudinary] ✅  Configured — cloud: ${CLOUDINARY_CLOUD_NAME}`);
  return true;
};

module.exports = { cloudinary, configureCloudinary };
