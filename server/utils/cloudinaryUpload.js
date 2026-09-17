const path = require("path");
const fs = require("fs");

// Shared Cloudinary storage helpers.
//
// Every uploaded image is received in MEMORY by multer
// (server/middleware/upload.js uses multer.memoryStorage) and pushed
// straight to Cloudinary from the backend. The API secret lives only
// here on the server and is never exposed to the React frontend.
//
// MongoDB only ever stores the returned secure_url (+ public_id), so
// nothing depends on the Render filesystem anymore.
const cloudinary = require("../cloudinary");

// Local uploads folder is kept ONLY so legacy records
// (/uploads/<file>, https://...onrender.com/uploads/<file>) can be
// cleaned up when they are replaced. New files are never written here.
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
const LEGACY_UPLOADS_PREFIX = "/uploads/";

// Cloudinary folders — one per feature that actually uploads.
const CLOUDINARY_FOLDERS = {
  blogs: "plutoastro/blogs",
  astrologers: "plutoastro/astrologers",
  users: "plutoastro/users",
  aiAstrologers: "plutoastro/ai-astrologers",
  chatAudio: "plutoastro/chat-audio",
};

// Hard ceiling so a stuck SDK promise can never leave an admin UI
// hanging on "Saving..." — the request always settles.
const CLOUDINARY_UPLOAD_TIMEOUT_MS = 30000;

/**
 * Uploads a multer memory buffer (req.file) to Cloudinary.
 *
 * The buffer is converted to a base64 data URI and handed to
 * cloudinary.uploader.upload() — the SDK's fully in-memory path.
 * Nothing is written to disk (not the project uploads/ folder, not
 * even the OS temp dir).
 *
 * NOTE: cloudinary.uploader.upload_stream MUST NOT be used with the
 * currently installed cloudinary build — its v1/v2 argument adapter
 * crashes the Node process ("TypeError: callback is not a function").
 *
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
const uploadBufferToCloudinary = async (file, options = {}) => {
  if (!file) {
    throw new Error("No file received.");
  }

  // multer.memoryStorage() → file.buffer. Path-based files (legacy)
  // are tolerated so this helper never silently drops an image.
  if (!file.buffer || !file.buffer.length) {
    if (file.path && fs.existsSync(file.path)) {
      file.buffer = fs.readFileSync(file.path);
      try {
        fs.unlinkSync(file.path);
      } catch (cleanupError) {
        /* best effort */
      }
    } else {
      throw new Error("No file data received.");
    }
  }

  const {
    folder = CLOUDINARY_FOLDERS.astrologers,
    resourceType = "image",
    transformation,
  } = options;

  const dataUri = `data:${
    file.mimetype || "application/octet-stream"
  };base64,${file.buffer.toString("base64")}`;

  const uploadOptions = {
    folder,
    resource_type: resourceType,
    timeout: CLOUDINARY_UPLOAD_TIMEOUT_MS,
  };

  if (transformation) {
    uploadOptions.transformation = transformation;
  }

  try {
    const uploadPromise = cloudinary.uploader.upload(
      dataUri,
      uploadOptions
    );

    // Belt-and-braces timeout: if the SDK promise never settles,
    // reject so the API responds instead of hanging.
    const timeoutPromise = new Promise((_, reject) => {
      const timer = setTimeout(
        () => reject(new Error("Upload timed out. Please try again.")),
        CLOUDINARY_UPLOAD_TIMEOUT_MS + 5000
      );

      if (typeof timer.unref === "function") {
        timer.unref();
      }
    });

    const result = await Promise.race([uploadPromise, timeoutPromise]);

    if (!result || !result.secure_url || !result.public_id) {
      throw new Error("Upload failed. Please try again.");
    }

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error(
      `Cloudinary upload failed (${folder}):`,
      error && (error.message || error)
    );

    // Surface Cloudinary's own message (invalid creds, quota,
    // disallowed format, timeout) when available.
    throw new Error(
      (error &&
        (error.message || (error.error && error.error.message))) ||
        "Upload failed. Please try again."
    );
  }
};
/**
 * Derives the Cloudinary public_id from a stored URL.
 * Returns null for non-Cloudinary (legacy /uploads/...) URLs.
 */
const extractCloudinaryPublicId = (imageUrl) => {
  try {
    if (
      !imageUrl ||
      typeof imageUrl !== "string" ||
      !imageUrl.includes("res.cloudinary.com")
    ) {
      return null;
    }

    const pathname = new URL(imageUrl).pathname;

    // .../<resource_type>/upload/[v<version>/]<public_id>.<ext>
    const match = pathname.match(
      /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./]+)?$/
    );

    return match && match[1] ? decodeURIComponent(match[1]) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Best-effort Cloudinary delete. Never throws — a Cloudinary failure
 * must not corrupt the database operation that triggered it.
 */
const destroyCloudinaryAsset = async (publicId, resourceType = "image") => {
  if (!publicId) return null;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });

    console.log(
      `🗑️ Cloudinary asset removed (${publicId}):`,
      result && result.result
    );

    return result;
  } catch (error) {
    console.warn(
      `Could not delete Cloudinary asset (${publicId}):`,
      error && error.message
    );

    return null;
  }
};

/**
 * Best-effort delete of a legacy locally-stored upload
 * (/uploads/<file> or https://<host>/uploads/<file>).
 */
const deleteLegacyLocalFile = (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== "string") return;

  try {
    let pathname = fileUrl;

    if (/^https?:\/\//i.test(fileUrl)) {
      pathname = new URL(fileUrl).pathname;
    }

    const prefixIndex = pathname.indexOf(LEGACY_UPLOADS_PREFIX);

    if (prefixIndex === -1) return;

    const relativePath = decodeURIComponent(
      pathname.slice(prefixIndex + LEGACY_UPLOADS_PREFIX.length)
    );

    if (!relativePath) return;

    const filePath = path.join(UPLOADS_DIR, relativePath);

    // Path traversal guard.
    if (!filePath.startsWith(UPLOADS_DIR)) return;

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.warn(
      "Could not delete legacy upload file:",
      error && error.message
    );
  }
};

/**
 * Removes a previously stored image, wherever it lives:
 *   1. New flow              → stored Cloudinary public_id → destroy.
 *   2. Legacy Cloudinary URL → derive public_id → destroy.
 *   3. Legacy local file (/uploads/...) → delete from disk.
 *
 * Fire-and-forget: callers should invoke this AFTER the database
 * write succeeded.
 */
const removeOldImage = ({
  imageUrl,
  publicId,
  resourceType = "image",
} = {}) => {
  if (!imageUrl && !publicId) return;

  try {
    const targetPublicId = publicId || extractCloudinaryPublicId(imageUrl);

    if (targetPublicId) {
      // Intentionally not awaited — cleanup must never block/fail the API.
      destroyCloudinaryAsset(targetPublicId, resourceType);
      return;
    }

    deleteLegacyLocalFile(imageUrl);
  } catch (error) {
    console.warn("Could not remove old image:", error && error.message);
  }
};

module.exports = {
  cloudinary,
  UPLOADS_DIR,
  CLOUDINARY_FOLDERS,
  CLOUDINARY_UPLOAD_TIMEOUT_MS,
  extractCloudinaryPublicId,
  deleteLegacyLocalFile,
  removeOldImage,
  uploadBufferToCloudinary,
  destroyCloudinaryAsset,
};