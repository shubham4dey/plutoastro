const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // ✅ Cloudinary config import kiya

/* =========================
   CLOUDINARY STORAGE CONFIG
========================= */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "plutoastro_uploads", // Cloudinary par is naam ka folder banega
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "jfif"],
    public_id: (req, file) => {
      // Unique naam generate karega (purane logic jaisa hi)
      return Date.now() + "-" + Math.round(Math.random() * 1e9);
    },
  },
});

/* =========================
   FILE FILTER (Early rejection ke liye)
========================= */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/jfif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, JPEG, PNG, WEBP, GIF and JFIF images are allowed."),
      false
    );
  }
};

/* =========================
   MULTER CONFIG
========================= */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit waisi hi rakhi hai
  },
});

module.exports = upload;