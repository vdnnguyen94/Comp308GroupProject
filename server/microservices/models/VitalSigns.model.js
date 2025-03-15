// vital-signs-microservice/models/VitalSigns.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vitalSignsSchema = new Schema({
  userId: { type: String, required: true },
  heartRate: { type: Number, required: true },
  bloodPressure: { type: String, required: true },
  temperature: { type: Number, required: true },
  timestamp: { type: String, default: new Date().toISOString() },
});

module.exports = mongoose.model('VitalSigns', vitalSignsSchema);
