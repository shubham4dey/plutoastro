const Astrologer = require("../models/Astrologer");

// Get all astrologers
const getAstrologers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search || "";

    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const total = await Astrologer.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const astrologers = await Astrologer.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      astrologers,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single astrologer
const getAstrologerById = async (req, res) => {
  try {
    const astrologer = await Astrologer.findById(req.params.id);

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: "Astrologer not found",
      });
    }

    res.status(200).json({
      success: true,
      astrologer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE Astrologer
const createAstrologer = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { name, experience, pricePerMinute, rating, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const astrologer = new Astrologer({
      name,
      experience: experience || 0,
      pricePerMinute: pricePerMinute || 10,
      rating: rating || 5,
      status: status || "online",
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await astrologer.save();

    res.status(201).json({
      success: true,
      message: "Astrologer created successfully",
      astrologer,
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE Astrologer
const updateAstrologer = async (req, res) => {
  try {
    const { name, experience, pricePerMinute, rating, status } = req.body;

    const updateData = {
      name,
      experience,
      pricePerMinute,
      rating,
      status,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const astrologer = await Astrologer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: "Astrologer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Astrologer updated successfully",
      astrologer,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE Astrologer
const deleteAstrologer = async (req, res) => {
  try {
    const astrologer = await Astrologer.findByIdAndDelete(req.params.id);

    if (!astrologer) {
      return res.status(404).json({
        success: false,
        message: "Astrologer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Astrologer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAstrologers,
  getAstrologerById,
  createAstrologer,
  updateAstrologer,
  deleteAstrologer,
};