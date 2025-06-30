const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  text: { 
    type: String,
    required: function() { return !this.attachment; } 
  },
  senderName: { type: String, required: true },
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'chat', required: true },
  date: { 
    type: Date, 
    default: Date.now 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  readAt: {
    type: Date,
    default: null 
  },
  forwarded: { 
    type: Boolean,
    default: false
  },
  attachment: {
    url: String,
    originalName: String,
    mimeType: String,
    size: Number,
    thumbnail: String
  }
});

module.exports = mongoose.model("message", MessageSchema);