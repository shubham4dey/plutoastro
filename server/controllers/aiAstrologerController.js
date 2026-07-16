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
      const astrologer =
        await AIAstrologer.create(
          req.body
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
      const astrologer =
        await AIAstrologer.findByIdAndUpdate(
          req.params.id,
          req.body,
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