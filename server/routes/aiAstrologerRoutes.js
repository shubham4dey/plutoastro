const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const AIAstrologer = require("../models/AIAstrologer");
const upload = require("../middleware/upload");

/* =========================
   GET ALL ACTIVE
========================= */
router.get("/", async (req, res) => {
  try {
    const astrologers =
      await AIAstrologer.find({
        isActive: true,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json(astrologers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =========================
   GET ALL FOR ADMIN
========================= */
router.get(
  "/admin/all",
  async (req, res) => {
    try {
      const astrologers =
        await AIAstrologer.find().sort({
          createdAt: -1,
        });

      res.status(200).json(
        astrologers
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

/* =========================
   GET SINGLE
========================= */
router.get(
  "/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid AI Astrologer ID",
        });
      }

      const astrologer =
        await AIAstrologer.findById(
          id
        );

      if (!astrologer) {
        return res.status(404).json({
          success: false,
          message:
            "AI Astrologer not found",
        });
      }

      res.status(200).json(
        astrologer
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

/* =========================
   CREATE
========================= */
router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        price,
        speciality,
        description,
        prompt,
        isActive,
      } = req.body;

      let image = "";

      if (req.file) {
        image = `${req.protocol}://${req.get(
          "host"
        )}/uploads/${
          req.file.filename
        }`;
      }

      const astrologer =
        await AIAstrologer.create({
          name,
          price:
            Number(price) ||
            0,
          description,
          prompt,
          image,

          speciality:
            typeof speciality ===
            "string"
              ? speciality
                  .split(",")
                  .map((item) =>
                    item.trim()
                  )
                  .filter(
                    Boolean
                  )
              : speciality ||
                [],

          isActive:
            isActive ===
            "false"
              ? false
              : true,
        });

      res.status(201).json({
        success: true,
        message:
          "AI Astrologer created successfully",
        astrologer,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

/* =========================
   UPDATE
========================= */
router.put(
  "/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid AI Astrologer ID",
        });
      }

      const astrologer =
        await AIAstrologer.findById(
          id
        );

      if (!astrologer) {
        return res.status(404).json({
          success: false,
          message:
            "AI Astrologer not found",
        });
      }

      if (
        req.body.name !==
        undefined
      ) {
        astrologer.name =
          req.body.name;
      }

      if (
        req.body.price !==
        undefined
      ) {
        astrologer.price =
          Number(
            req.body.price
          );
      }

      if (
        req.body.description !==
        undefined
      ) {
        astrologer.description =
          req.body.description;
      }

      if (
        req.body.prompt !==
        undefined
      ) {
        astrologer.prompt =
          req.body.prompt;
      }

      if (
        req.body.speciality !==
        undefined
      ) {
        astrologer.speciality =
          typeof req.body
            .speciality ===
          "string"
            ? req.body.speciality
                .split(",")
                .map((item) =>
                  item.trim()
                )
                .filter(
                  Boolean
                )
            : req.body
                .speciality;
      }

      if (
        req.body.isActive !==
        undefined
      ) {
        astrologer.isActive =
          req.body
            .isActive ===
          "true";
      }

      if (req.file) {
        astrologer.image =
          `${req.protocol}://${req.get(
            "host"
          )}/uploads/${
            req.file.filename
          }`;
      }

      await astrologer.save();

      res.status(200).json({
        success: true,
        message:
          "AI Astrologer updated successfully",
        astrologer,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

/* =========================
   DELETE
========================= */
router.delete(
  "/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid AI Astrologer ID",
        });
      }

      const astrologer =
        await AIAstrologer.findById(
          id
        );

      if (!astrologer) {
        return res.status(404).json({
          success: false,
          message:
            "AI Astrologer not found",
        });
      }

      await astrologer.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "AI Astrologer deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

/* =========================
   TOGGLE STATUS
========================= */
router.patch(
  "/:id/status",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid AI Astrologer ID",
        });
      }

      const astrologer =
        await AIAstrologer.findById(
          id
        );

      if (!astrologer) {
        return res.status(404).json({
          success: false,
          message:
            "AI Astrologer not found",
        });
      }

      astrologer.isActive =
        !astrologer.isActive;

      await astrologer.save();

      res.status(200).json({
        success: true,
        message:
          "Status updated successfully",
        astrologer,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

module.exports = router;