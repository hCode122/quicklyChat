const fs = require('fs');
const sharp = require('sharp');
const Message = require('../models/Message');


exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Uploaded file info:', req.file);

    const { originalname, mimetype, size } = req.file;

    const url = req.file.secure_url || req.file.path;

    const newMessage = {
      senderName: req.body.senderName,
      chatId: req.body.chatId,
      text: req.body.text || '',
      attachment: {
        url,
        originalName: originalname,
        mimeType: mimetype,
        size,
        thumbnail: mimetype.startsWith('image/') ? url : null,
      }
    };

    const message = await Message.create(newMessage);
    req.app.locals.io.to(req.body.chatId).emit('new_message', message);

    res.status(201).json(message);

  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: err.message });
  }
};

