const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // ✅ SIRF YE LINE ADD KI HAI TOP PAR

const AstrologerApplication = require("../models/AstrologerApplication");
const Astrologer = require("../models/Astrologer");
const upload = require("../middleware/upload");

// Permanent image storage — multer memory buffer → Cloudinary.
const {
  CLOUDINARY_FOLDERS,
  uploadBufferToCloudinary,
  destroyCloudinaryAsset,
  removeOldImage,
} = require("../utils/cloudinaryUpload");

/* =========================
   APPLY AS ASTROLOGER
========================= */
router.post(
  "/apply",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        password,
        experience,
        languages,
        speciality,
        price,
        about,
      } = req.body;

      const existing = await AstrologerApplication.findOne({ email });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Application already exists",
        });
      }

      // Upload the selected photo straight to Cloudinary (memory → cloud).
      let uploadedImage = null;

      if (req.file) {
        try {
          uploadedImage = await uploadBufferToCloudinary(req.file, {
            folder: CLOUDINARY_FOLDERS.astrologers,
          });
        } catch (uploadError) {
          return res.status(500).json({
            success: false,
            message: uploadError.message,
          });
        }
      }

      let application;

      try {
        application = await AstrologerApplication.create({
        name,
        email,
        phone,
        password,
        image: uploadedImage ? uploadedImage.secure_url : "",
        imagePublicId: uploadedImage ? uploadedImage.public_id : "",
        experience: Number(experience) || 0,

        languages:
          typeof languages === "string"
            ? languages.split(",").map((item) => item.trim()).filter(Boolean)
            : [],

        speciality:
          typeof speciality === "string"
            ? speciality.split(",").map((item) => item.trim()).filter(Boolean)
            : [],

        price: Number(price) || 10,
        about,
        status: "pending",
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
        message: "Application Submitted Successfully",
        application,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================
   ADMIN ALL APPLICATIONS
========================= */
router.get("/admin/all", async (req, res) => {
  try {
    const applications = await AstrologerApplication.find().sort({
      createdAt: -1,
    });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   GET PENDING APPLICATIONS
========================= */
router.get("/admin/pending", async (req, res) => {
  try {
    const applications = await AstrologerApplication.find({
      status: "pending",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   ✅ APPROVE APPLICATION (SIRF YAHAN CHANGE KIYA HAI)
========================= */
router.patch("/approve/:id", async (req, res) => {
  try {
    const application = await AstrologerApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Already approved",
      });
    }

    // ✅ Name ki jagah Email se check karna zyada safe hai
    const alreadyExists = await Astrologer.findOne({
      email: application.email,
    });

    if (!alreadyExists) {
      // ✅ Password ko hash karo taaki secure rahe (Login ke liye zaroori)
      const hashedPassword = await bcrypt.hash(application.password, 10);

      await Astrologer.create({
        name: application.name,
        email: application.email,             // ✅ ADDED
        password: hashedPassword,             // ✅ ADDED
        image: application.image,
        imagePublicId: application.imagePublicId || "",
        experience: Number(application.experience) || 0,
        languages: application.languages || [],
        skills: application.speciality || [],
        pricePerMinute: Number(application.price) || 10,
        rating: 5,
        status: "offline",                    // ✅ Offline rakha taaki wo dashboard se khud online kare
        orders: 0,
        verified: true,
        isApproved: true,                     // ✅ ADDED (Schema ke hisaab se)
        totalCallDurationInMin: 0,
        totalChatDurationInMin: 0,
      });
    }

    application.status = "approved";
    await application.save();

    res.status(200).json({
      success: true,
      message: "Astrologer Approved Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   REJECT APPLICATION
========================= */
router.patch("/reject/:id", async (req, res) => {
  try {
    const application = await AstrologerApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = "rejected";
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application Rejected",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   DELETE APPLICATION
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const application = await AstrologerApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Best-effort cleanup of the application photo (Cloudinary asset
    // by public_id, or legacy /uploads/ file).
    removeOldImage({
      imageUrl: application.image,
      publicId: application.imagePublicId,
    });

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;