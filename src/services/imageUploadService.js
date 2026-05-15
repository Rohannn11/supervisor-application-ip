/**
 * imageUploadService.js
 *
 * Expo-compatible service for uploading images to the backend → Cloudinary pipeline.
 * Uses multipart/form-data (required for React Native — no base64 bloat).
 * All functions are async-safe and return structured { success, data, error } objects.
 *
 * Usage:
 *   import { uploadOccurrenceImages } from '../services/imageUploadService';
 *   const result = await uploadOccurrenceImages(uriArray, { incidentId, shiftId, spotId }, token);
 */

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:3000';
const MOCK_TOKEN = process.env.EXPO_PUBLIC_MOCK_TOKEN || 'mock-token-12345';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a multipart FormData object from an array of local file URIs.
 *
 * @param {string[]} uris           - Local file URIs from ImagePicker/Camera
 * @param {string}   fieldName      - Form field name ('images' or 'image')
 * @param {object}   extraFields    - Additional text fields to attach
 * @returns {FormData}
 */
const buildFormData = (uris, fieldName = 'images', extraFields = {}) => {
  const form = new FormData();

  uris.forEach((uri) => {
    const fileName = uri.split('/').pop() || `upload_${Date.now()}.jpg`;
    const ext = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeMap = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg',
      png: 'image/png',  webp: 'image/webp',
      gif: 'image/gif',  mp4: 'video/mp4',
      mov: 'video/quicktime', pdf: 'application/pdf',
    };
    const mimeType = mimeMap[ext] || 'image/jpeg';

    // React Native FormData accepts { uri, name, type } objects
    form.append(fieldName, { uri, name: fileName, type: mimeType });
  });

  // Attach additional text fields
  Object.entries(extraFields).forEach(([key, val]) => {
    if (val !== null && val !== undefined) {
      form.append(key, String(val));
    }
  });

  return form;
};

/**
 * Core fetch wrapper — handles timeout, error parsing, and structured response.
 *
 * @param {string} endpoint   - Relative path, e.g. '/api/images/occurrence'
 * @param {FormData} form
 * @param {string} authToken  - Bearer token
 * @param {number} timeoutMs  - Timeout in milliseconds (default 30 s)
 * @returns {Promise<{success, data, error}>}
 */
const postForm = async (endpoint, form, authToken, timeoutMs = 30000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken || MOCK_TOKEN}`,
        // NOTE: Do NOT set Content-Type manually — React Native sets it automatically
        //       with the correct multipart boundary when body is FormData.
      },
      body: form,
      signal: controller.signal,
    });

    const text = await response.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { message: text }; }

    if (!response.ok) {
      return { success: false, error: json.error || `HTTP ${response.status}` };
    }
    return { success: true, data: json };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { success: false, error: 'Upload timed out. Check your connection.' };
    }
    return { success: false, error: err.message || 'Network error.' };
  } finally {
    clearTimeout(timeoutId);
  }
};

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Upload 1–5 evidence images for an occurrence report.
 *
 * @param {string[]} uris     - Array of local file URIs
 * @param {object}   meta     - { incidentId, shiftId, spotId }
 * @param {string}   token    - Firebase auth token
 * @returns {Promise<{success, data, error}>}
 */
export const uploadOccurrenceImages = async (uris, meta = {}, token = null) => {
  if (!uris || uris.length === 0) {
    return { success: false, error: 'No images provided.' };
  }
  const form = buildFormData(uris, 'images', {
    incidentId: meta.incidentId || '',
    shiftId:    meta.shiftId    || '',
    spotId:     meta.spotId     || '',
  });
  return postForm('/api/images/occurrence', form, token);
};

/**
 * Upload a single checklist evidence photo (for a 'No' answer).
 *
 * @param {string} uri           - Local file URI
 * @param {object} meta          - { reportId, shiftId, spotId, checklistItemId }
 * @param {string} token
 * @returns {Promise<{success, data, error}>}
 */
export const uploadChecklistEvidence = async (uri, meta = {}, token = null) => {
  if (!uri) return { success: false, error: 'No image provided.' };
  const form = buildFormData([uri], 'image', {
    reportId:        meta.reportId        || '',
    shiftId:         meta.shiftId         || '',
    spotId:          meta.spotId          || '',
    checklistItemId: meta.checklistItemId || '',
  });
  return postForm('/api/images/checklist', form, token);
};

/**
 * Upload up to 10 images for a complete patrol/shift report.
 *
 * @param {string[]} uris
 * @param {object}   meta    - { reportId, shiftId }
 * @param {string}   token
 * @returns {Promise<{success, data, error}>}
 */
export const uploadReportImages = async (uris, meta = {}, token = null) => {
  if (!uris || uris.length === 0) {
    return { success: false, error: 'No images provided.' };
  }
  const form = buildFormData(uris, 'images', {
    reportId: meta.reportId || '',
    shiftId:  meta.shiftId  || '',
  });
  return postForm('/api/images/report', form, token);
};

/**
 * Fetch all images for a given incidentId from the backend.
 *
 * @param {string} incidentId
 * @param {string} token
 * @returns {Promise<{success, data, error}>}
 */
export const fetchIncidentImages = async (incidentId, token = null) => {
  try {
    const response = await fetch(`${API_BASE}/api/images/incident/${incidentId}`, {
      headers: { 'Authorization': `Bearer ${token || MOCK_TOKEN}` },
    });
    const json = await response.json();
    if (!response.ok) return { success: false, error: json.error };
    return { success: true, data: json };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Fetch all images uploaded by the current user.
 *
 * @param {string} token
 * @param {number} limit
 * @returns {Promise<{success, data, error}>}
 */
export const fetchMyImages = async (token = null, limit = 50) => {
  try {
    const response = await fetch(`${API_BASE}/api/images/my?limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token || MOCK_TOKEN}` },
    });
    const json = await response.json();
    if (!response.ok) return { success: false, error: json.error };
    return { success: true, data: json };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
