const multer = require("multer");

// Image uploads are staged in MEMORY only and pushed straight to
// Cloudinary by the route/controller (see server/utils/cloudinaryUpload.js).
// Nothing is written to the project's uploads/ folder anymore, so
// uploaded images survive Render restarts and redeploys.

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
    return;
  }

  cb(
    new Error("Only JPG, JPEG, PNG, WEBP, GIF and JFIF images are allowed."),
    false
  );
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = upload;