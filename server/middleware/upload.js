const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "plutoastro_uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "jfif"],
    resource_type: "image",
    public_id: () => {
      return `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    },
  },
});

const fileFilter = (req, file, cb) => {
  if (!hasCloudinaryConfig) {
    cb(
      new Error(
        "Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
      ),
      false
    );
    return;
  }

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
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;
