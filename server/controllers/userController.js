const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const User = require('../models/User');


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (req.file) {
      user.profilePic = {
        url: req.file.path,
        thumbnail: req.file.path, 
      };
    }

    if (bio !== undefined) user.bio = bio;
    await user.save();

    res.status(200).json({
      message: 'Profile updated',
      profilePic: user.profilePic.url,
      profilePicThumb: user.profilePic.thumbnail,
      bio: user.bio,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Profile update failed' });
  }
};



exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('name profilePic bio');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      profilePic: user.profilePic,  
      bio: user.bio || ''
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};