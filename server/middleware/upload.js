const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* =========================
   UPLOAD DIRECTORY
========================= */

const uploadPath = path.resolve(
  __dirname,
  "..",
  "uploads"
);

// Automatically create uploads folder
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });

  console.log(
    "✅ Upload folder created:",
    uploadPath
  );
}

console.log(
  "📁 Upload Directory:",
  uploadPath
);

/* =========================
   STORAGE CONFIG
========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const extension =
      path.extname(file.originalname) ||
      ".png";

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extension.toLowerCase();

    cb(null, uniqueName);
  },
});

/* =========================
   FILE FILTER
========================= */

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/jfif",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP, GIF and JFIF images are allowed."
      ),
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
    fileSize:
      10 * 1024 * 1024, // 10 MB
  },
});

module.exports = upload;