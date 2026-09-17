const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../cloudinary');

// Configure multer for in-memory file upload — the buffer is pushed
// straight to Cloudinary below. Nothing is written to the local disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

/**
 * POST /api/upload/astrologer
 * Upload astrologer image to Cloudinary
 */
router.post('/astrologer', upload.single('image'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    // Upload to Cloudinary straight from the in-memory buffer.
    const dataUri =
      'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64');

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'plutoastro/astrologers',
      width: 400,
      height: 400,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });

    // Send response
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    
    // Nothing to clean up locally — the image never touched the disk.

    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload image',
      error: error.message 
    });
  }
});

/**
 * POST /api/upload/delete
 * Delete image from Cloudinary
 */
router.post('/delete', async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Public ID is required' 
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    res.json({
      success: true,
      message: 'Image deleted successfully',
      result: result,
    });

  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete image',
      error: error.message 
    });
  }
});

module.exports = router;