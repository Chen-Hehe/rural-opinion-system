const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    opinionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opinion',
      required: true,
    },
    officialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reply', replySchema);
