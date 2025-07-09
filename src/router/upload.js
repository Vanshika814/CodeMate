const express = require('express');
const UploadRouter = express.Router();
const cloudinary = require('../utils/cloudinary');

UploadRouter.post('/upload/project', async (req, res) => {
  const { image } = req.body; // image is expected as a base64 string

  try {
    const uploaded = await cloudinary.uploader.upload(image, {
      folder: 'devtinder_project',
    });
    res.json({ success: true, imageUrl: uploaded.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

module.exports = UploadRouter;
