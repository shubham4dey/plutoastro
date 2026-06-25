const express = require("express");
const router = express.Router();

const AstrologerApplication =
  require("../models/AstrologerApplication");

const Astrologer =
  require("../models/Astrologer");

const upload =
  require("../middleware/upload");

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

      const existing =
        await AstrologerApplication.findOne({
          email,
        });

      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            "Application already exists",
        });
      }

      let image = "";

      if (req.file) {
        image = `${req.protocol}://${req.get(
          "host"
        )}/uploads/${req.file.filename}`;
      }

      const application =
        await AstrologerApplication.create({
          name,
          email,
          phone,
          password,
          image,
          experience: Number(experience) || 0,

          languages:
            typeof languages === "string"
              ? languages
                  .split(",")
                  .map((item) =>
                    item.trim()
                  )
                  .filter(Boolean)
              : [],

          speciality:
            typeof speciality === "string"
              ? speciality
                  .split(",")
                  .map((item) =>
                    item.trim()
                  )
                  .filter(Boolean)
              : [],

          price: Number(price) || 10,

          about,

          status: "pending",
        });

      res.status(201).json({
        success: true,
        message:
          "Application Submitted Successfully",
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

router.get(
  "/admin/all",
  async (req, res) => {
    try {
      const applications =
        await AstrologerApplication.find()
          .sort({
            createdAt: -1,
          });

      res.status(200).json(
        applications
      );
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================
   GET PENDING APPLICATIONS
========================= */

router.get(
  "/admin/pending",
  async (req, res) => {
    try {
      const applications =
        await AstrologerApplication.find({
          status: "pending",
        }).sort({
          createdAt: -1,
        });

      res.status(200).json(
        applications
      );
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================
   APPROVE APPLICATION
========================= */

router.patch(
  "/approve/:id",
  async (req, res) => {
    try {
      const application =
        await AstrologerApplication.findById(
          req.params.id
        );

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      if (
        application.status ===
        "approved"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Already approved",
        });
      }

      const alreadyExists =
        await Astrologer.findOne({
          name: application.name,
        });

      if (!alreadyExists) {
        await Astrologer.create({
          name: application.name,

          image:
            application.image,

          experience:
            Number(
              application.experience
            ) || 0,

          languages:
            application.languages ||
            [],

          skills:
            application.speciality ||
            [],

          pricePerMinute:
            Number(
              application.price
            ) || 10,

          rating: 5,

          status: "online",

          orders: 0,

          verified: true,

          totalCallDurationInMin: 0,

          totalChatDurationInMin: 0,
        });
      }

      application.status =
        "approved";

      await application.save();

      res.status(200).json({
        success: true,
        message:
          "Astrologer Approved Successfully",
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
   REJECT APPLICATION
========================= */

router.patch(
  "/reject/:id",
  async (req, res) => {
    try {
      const application =
        await AstrologerApplication.findById(
          req.params.id
        );

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      application.status =
        "rejected";

      await application.save();

      res.status(200).json({
        success: true,
        message:
          "Application Rejected",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/* =========================
   DELETE APPLICATION
========================= */

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const application =
        await AstrologerApplication.findByIdAndDelete(
          req.params.id
        );

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Application deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;