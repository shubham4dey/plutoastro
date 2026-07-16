const AIAstrologer = require("../models/AIAstrologer");

exports.getAIAstrologers = async (req, res) => {
  try {
    const astrologers =
      await AIAstrologer.find();

    res.json(astrologers);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAIAstrologerById =
  async (req, res) => {
    try {
      const astrologer =
        await AIAstrologer.findById(
          req.params.id
        );

      if (!astrologer) {
        return res.status(404).json({
          message:
            "AI Astrologer not found",
        });
      }

      res.json(astrologer);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

exports.createAIAstrologer =
  async (req, res) => {
    try {
      // ✅ CHANGE: Cloudinary URL use karo agar file upload hui hai
      const astrologerData = { ...req.body };
      if (req.file) {
        astrologerData.image = req.file.path;
      }

      const astrologer =
        await AIAstrologer.create(
          astrologerData
        );

      res.status(201).json(
        astrologer
      );
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

exports.updateAIAstrologer =
  async (req, res) => {
    try {
      const updateData = { ...req.body };
      
      // ✅ CHANGE: Cloudinary URL use karo agar nayi file upload hui hai
      if (req.file) {
        updateData.image = req.file.path;
      }

      const astrologer =
        await AIAstrologer.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
          }
        );

      res.json(astrologer);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

exports.deleteAIAstrologer =
  async (req, res) => {
    try {
      await AIAstrologer.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Deleted",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };