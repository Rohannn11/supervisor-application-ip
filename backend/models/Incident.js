const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  siteId: { type: String },
  time: { type: Date, default: Date.now },
  description: { type: String },
  evidenceUrls: [{ type: String }],
  status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Incident', incidentSchema);
