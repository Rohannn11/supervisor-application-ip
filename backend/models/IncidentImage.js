const mongoose = require('mongoose');

/**
 * IncidentImage — stores Cloudinary metadata for every uploaded evidence file.
 *
 * IMPORTANT: actual binary is stored in Cloudinary.
 *            This document stores ONLY metadata pointers.
 */
const incidentImageSchema = new mongoose.Schema(
  {
    // ── Reference fields ─────────────────────────────────────────────────────
    incidentId: {
      type: String,
      index: true,
      default: null,
      comment: 'SQL occurrence id this image belongs to',
    },
    reportId: {
      type: String,
      index: true,
      default: null,
      comment: 'Patrol report / checklist submission id',
    },
    checklistItemId: {
      type: Number,
      default: null,
      comment: 'Checklist question id if this image is evidence for a specific question',
    },
    shiftId: { type: String, default: null },
    spotId:  { type: String, default: null },

    // ── Uploader info ─────────────────────────────────────────────────────────
    uploadedBy: {
      type: String,
      required: true,
      index: true,
      comment: 'Firebase UID of the supervisor',
    },
    uploaderPhone: { type: String, default: null },

    // ── Cloudinary fields ─────────────────────────────────────────────────────
    imageUrl: {
      type: String,
      required: true,
      comment: 'Secure HTTPS Cloudinary delivery URL',
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
      comment: 'Cloudinary public_id — used for deletion / transformation',
    },
    resourceType: {
      type: String,
      enum: ['image', 'video', 'raw'],
      default: 'image',
    },
    mimeType: { type: String, required: true },
    size: {
      type: Number,
      required: true,
      comment: 'File size in bytes',
    },
    width:  { type: Number, default: null },
    height: { type: Number, default: null },
    format: { type: String, default: null },

    // ── Context ───────────────────────────────────────────────────────────────
    uploadContext: {
      type: String,
      enum: ['checklist_evidence', 'occurrence_evidence', 'patrol_report', 'other'],
      default: 'other',
    },

    // ── Redis-ready caching hint ──────────────────────────────────────────────
    // cacheKey is computed but not stored — reserved for future Redis integration
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
    collection: 'incident_images',
  }
);

// ── Compound indices for efficient querying ──────────────────────────────────
incidentImageSchema.index({ uploadedBy: 1, createdAt: -1 });
incidentImageSchema.index({ incidentId: 1, createdAt: -1 });
incidentImageSchema.index({ reportId: 1, uploadContext: 1 });

// ── Virtual: Redis-ready cache key ───────────────────────────────────────────
incidentImageSchema.virtual('cacheKey').get(function () {
  return `img:${this.publicId}`;
});

module.exports = mongoose.model('IncidentImage', incidentImageSchema);
