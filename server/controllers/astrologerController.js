const Astrologer = require("../models/Astrologer");

// Permanent image storage — images go straight from memory to Cloudinary.
const {
  CLOUDINARY_FOLDERS,
  uploadBufferToCloudinary,
  destroyCloudinaryAsset,
  removeOldImage,
} = require("../utils/cloudinaryUpload");

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

// Uploads the multer memory buffer straight to Cloudinary and returns
// { secure_url, public_id }, or null when no file was selected.
const uploadImageIfPresent = async (file) => {
  if (!file) {
    return null;
  }

  return uploadBufferToCloudinary(file, {
    folder: CLOUDINARY_FOLDERS.astrologers,
  });
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

    // Upload the selected image straight to Cloudinary (memory → cloud).
    let uploadedImage = null;

    if (req.file) {
      try {
        uploadedImage = await uploadImageIfPresent(req.file);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: uploadError.message,
        });
      }
    }

    let astrologer;

    try {
      astrologer = await Astrologer.create({
        name: name.trim(),
        experience: Number(experience) || 0,
        pricePerMinute: Number(pricePerMinute) || 10,
        rating: Number(rating) || 5,
        status: status || "online",
        skills: parseArrayField(skills) || [],
        languages: parseArrayField(languages) || [],
        image: uploadedImage
          ? uploadedImage.secure_url
          : req.body.image || "",
        imagePublicId: uploadedImage ? uploadedImage.public_id : "",
      });
    } catch (createError) {
      // DB write failed after upload → clean up the orphaned asset.
      if (uploadedImage) {
        destroyCloudinaryAsset(uploadedImage.public_id);
      }

      throw createError;
    }

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

    let uploadedImage = null;
    let previousImage = "";
    let previousImagePublicId = "";

    if (req.file) {
      // Read the current image first so it can be deleted only after the
      // replacement has been saved successfully.
      const existing = await Astrologer.findById(req.params.id).select(
        "image imagePublicId"
      );

      if (existing) {
        previousImage = existing.image || "";
        previousImagePublicId = existing.imagePublicId || "";
      }

      try {
        uploadedImage = await uploadImageIfPresent(req.file);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: uploadError.message,
        });
      }

      updateData.image = uploadedImage.secure_url;
      updateData.imagePublicId = uploadedImage.public_id;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data to update",
      });
    }

    let astrologer;

    try {
      astrologer = await Astrologer.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (updateError) {
      // DB write failed after upload → clean up the orphaned asset.
      if (uploadedImage) {
        destroyCloudinaryAsset(uploadedImage.public_id);
      }

      throw updateError;
    }

    if (!astrologer) {
      if (uploadedImage) {
        destroyCloudinaryAsset(uploadedImage.public_id);
      }

      return res.status(404).json({
        success: false,
        message: "Astrologer not found",
      });
    }

    // New image is saved — now drop the previous one (Cloudinary asset
    // by public_id, or legacy /uploads/ file).
    if (uploadedImage && (previousImage || previousImagePublicId)) {
      removeOldImage({
        imageUrl: previousImage,
        publicId: previousImagePublicId,
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

    // Best-effort cleanup of the stored image.
    removeOldImage({
      imageUrl: astrologer.image,
      publicId: astrologer.imagePublicId,
    });

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
