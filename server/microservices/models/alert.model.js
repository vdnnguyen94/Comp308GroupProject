const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, enum: ['active', 'expired'], default: 'active' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dismissedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);

