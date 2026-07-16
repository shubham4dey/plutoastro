const Astrologer = require("../models/Astrologer");

const parseArrayField = (value) => {
  if (value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const getUploadedImageUrl = (file) => {
  if (!file) {
    return "";
  }

  return file.path || file.secure_url || file.url || "";
};

const getAstrologers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const search = req.query.search || "";

    const query = {};
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

const createAstrologer = async (req, res) => {
  try {
    const {
      name,
      experience,
      pricePerMinute,
      rating,
      status,
      skills,
      languages,
    } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const astrologer = await Astrologer.create({
      name: name.trim(),
      experience: Number(experience) || 0,
      pricePerMinute: Number(pricePerMinute) || 10,
      rating: Number(rating) || 5,
      status: status || "online",
      skills: parseArrayField(skills) || [],
      languages: parseArrayField(languages) || [],
      image: getUploadedImageUrl(req.file) || req.body.image || "",
    });

    res.status(201).json({
      success: true,
      message: "Astrologer created successfully",
      astrologer,
    });
  } catch (error) {
    console.error("Create astrologer error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAstrologer = async (req, res) => {
  try {
    const {
      name,
      experience,
      pricePerMinute,
      rating,
      status,
      skills,
      languages,
    } = req.body;

    const updateData = {};

    if (name !== undefined) {
      if (name.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }
      updateData.name = name.trim();
    }

    if (experience !== undefined) {
      updateData.experience = Number(experience);
    }

    if (pricePerMinute !== undefined) {
      updateData.pricePerMinute = Number(pricePerMinute);
    }

    if (rating !== undefined) {
      updateData.rating = Number(rating);
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    const parsedSkills = parseArrayField(skills);
    if (parsedSkills !== undefined) {
      updateData.skills = parsedSkills;
    }

    const parsedLanguages = parseArrayField(languages);
    if (parsedLanguages !== undefined) {
      updateData.languages = parsedLanguages;
    }

    const uploadedImageUrl = getUploadedImageUrl(req.file);
    if (uploadedImageUrl) {
      updateData.image = uploadedImageUrl;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data to update",
      });
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
    console.error("Update astrologer error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
