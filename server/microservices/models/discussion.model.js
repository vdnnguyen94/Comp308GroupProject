const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: String,

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  city: {
    type: String,
    enum: ['Hamilton', 'Kitchener', 'London', 'Windsor', 'Toronto', 'Ottawa']
  },

  createdAt: {
    type: Date,
    default: Date.now
  },


  summary: {
    type: String
  }
});
discussionSchema.pre('remove', async function (next) {
    await mongoose.model('Comment').deleteMany({ discussion: this._id });
    next();
  });
module.exports = mongoose.model('Discussion', discussionSchema);

  