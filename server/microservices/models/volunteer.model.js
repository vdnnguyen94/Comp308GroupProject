const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
  city: { type: String, required: true },
  interests: [String],
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    from: String, // "09:00"
    to: String    // "17:00"
  }]
}, { timestamps: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
