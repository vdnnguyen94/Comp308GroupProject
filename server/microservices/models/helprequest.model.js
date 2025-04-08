const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  city: { type: String, required: true },
  category: { type: String }, 
  description: { type: String }, 

  analysis: { type: String }, 

  bestMatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 

  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['open', 'matched', 'closed'],
    default: 'open'
  }
});

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
