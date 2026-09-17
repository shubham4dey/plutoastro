const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const Blog = require("../models/Blog");

// Permanent image storage — credentials come from
// CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY /
// CLOUDINARY_API_SECRET (configured in server/cloudinary.js).
// The API secret stays on the backend and is never exposed
// to the React frontend.
const cloudinary = require("../cloudinary");

// =====================================================
// AUTH
// =====================================================

const authModule = require("../middleware/auth");

const adminAuth =
  typeof authModule === "function"
    ? authModule
    : authModule.adminAuth ||
      authModule.requireAdmin ||
      authModule.authenticateAdmin ||
      authModule.auth;

if (typeof adminAuth !== "function") {
  throw new Error(
    "Could not find a valid admin authentication middleware in server/middleware/auth.js"
  );
}

// =====================================================
// UPLOAD CONFIGURATION
// Images are staged in MEMORY only (multer.memoryStorage)
// and streamed straight to Cloudinary — nothing is written
// to the Render filesystem, so blog images survive
// restarts and redeploys.
// =====================================================

// Kept ONLY for deleteLocalImage() below, which cleans up
// images stored by the legacy local-disk flow.
const uploadsDir = path.join(
  __dirname,
  "..",
  "uploads",
  "blogs"
);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {
    recursive: true,
  });
}

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
        )
      );
    }

    cb(null, true);
  },
});

// =====================================================
// HELPERS
// =====================================================

const parseTags = (tags) => {
  if (!tags) return [];

  if (Array.isArray(tags)) {
    return tags
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  }

  return String(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const parseBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (
    value === "true" ||
    value === "1" ||
    value === "on"
  ) {
    return true;
  }

  return false;
};

// =====================================================
// CLOUDINARY STORAGE (permanent image hosting)
// Images are uploaded from the backend to Cloudinary and
// ONLY the returned secure_url is stored in MongoDB — the
// frontend renders that URL directly.
// =====================================================

const CLOUDINARY_BLOGS_FOLDER = "plutoastro/blogs";

// Hard ceiling for the Cloudinary upload. If the SDK/promise never
// settles (network black hole, SDK quirk), the API still responds
// and the admin UI never stays stuck on "Saving...".
const CLOUDINARY_UPLOAD_TIMEOUT_MS = 30000;

// Uploads the multer MEMORY buffer straight to Cloudinary and
// resolves { secure_url, public_id }.
//
// The buffer is converted to a base64 data URI and passed to
// cloudinary.uploader.upload(dataUri, options) — the SDK's supported
// fully in-memory upload path. Nothing is ever written to disk:
// not the project's uploads/blogs folder, not even the OS temp dir.
//
// NOTE: cloudinary.uploader.upload_stream MUST NOT be used with the
// currently installed cloudinary@1.21.0 build — its v1/v2 argument
// adapter crashes the entire Node process with
// "TypeError: callback is not a function" (verified empirically),
// which killed the API and left the admin UI stuck on "Saving...".
const uploadBlogImageToCloudinary = async (file) => {
  if (!file || !file.buffer || !file.buffer.length) {
    throw new Error("No image data received.");
  }

  // In-memory only: multer.memoryStorage() buffer → base64 data URI.
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  try {
    const uploadPromise = cloudinary.uploader.upload(dataUri, {
      folder: CLOUDINARY_BLOGS_FOLDER,
      resource_type: "image",
      timeout: CLOUDINARY_UPLOAD_TIMEOUT_MS,
    });

    // Belt-and-braces timeout: if the SDK promise never settles,
    // reject so the request returns an error instead of hanging.
    const timeoutPromise = new Promise((_, reject) => {
      const timer = setTimeout(
        () =>
          reject(
            new Error(
              "Image upload timed out. Please try again."
            )
          ),
        CLOUDINARY_UPLOAD_TIMEOUT_MS + 5000
      );

      // Don't let the safety timer keep the process alive.
      if (typeof timer.unref === "function") {
        timer.unref();
      }
    });

    const result = await Promise.race([
      uploadPromise,
      timeoutPromise,
    ]);

    if (!result || !result.secure_url) {
      throw new Error(
        "Image upload failed. Please try again."
      );
    }

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error(
      "Cloudinary blog image upload failed:",
      error
    );

    // Surface Cloudinary's own message (invalid creds, quota,
    // disallowed format, timeout) when available.
    throw new Error(
      (error &&
        (error.message ||
          (error.error && error.error.message))) ||
      "Image upload failed. Please try again."
    );
  }
};

// Best-effort: derive the Cloudinary public_id from a stored
// URL. Used only for blogs created before the
// featuredImagePublicId field existed. Returns null for
// non-Cloudinary (legacy local /uploads/...) URLs.
const extractCloudinaryPublicId = (imageUrl) => {
  try {
    if (
      !imageUrl ||
      !imageUrl.includes("res.cloudinary.com")
    ) {
      return null;
    }

    const pathname =
      new URL(imageUrl).pathname;

    // .../upload/[v<version>/]<public_id>.<ext>
    const match = pathname.match(
      /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./]+)?$/
    );

    return match && match[1]
      ? decodeURIComponent(match[1])
      : null;
  } catch (error) {
    return null;
  }
};

const deleteLocalImage = (imageUrl) => {
  if (!imageUrl) return;

  try {
    const pathname = new URL(imageUrl).pathname;

    const filename = path.basename(pathname);

    const filePath = path.join(
      uploadsDir,
      filename
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.warn(
      "Could not delete blog image:",
      error.message
    );
  }
};

const cleanupUploadedFile = (file) => {
  if (!file) return;

  try {
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  } catch (error) {
    console.warn(
      "Could not cleanup uploaded file:",
      error.message
    );
  }
};

// Safely removes the previous blog image, wherever it lives:
//   1. New flow            — stored Cloudinary public_id → destroy.
//   2. Legacy Cloudinary URL — derive public_id → destroy.
//   3. Legacy local file (/uploads/blogs/...) — delete from disk.
// Best-effort only: failures are logged and never break the
// blog create/update/delete request itself.
const destroyOldBlogImage = ({ imageUrl, publicId } = {}) => {
  if (!imageUrl && !publicId) return;

  try {
    const targetPublicId =
      publicId || extractCloudinaryPublicId(imageUrl);

    if (targetPublicId) {
      cloudinary.uploader
        .destroy(targetPublicId)
        .then((result) =>
          console.log(
            `🗑️ Old blog image removed from Cloudinary (${targetPublicId}):`,
            result && result.result
          )
        )
        .catch((error) =>
          console.warn(
            `Could not delete old Cloudinary image (${targetPublicId}):`,
            error && error.message
          )
        );

      return;
    }

    // Legacy local image from the old Render-disk flow.
    deleteLocalImage(imageUrl);
  } catch (error) {
    console.warn(
      "Could not delete old blog image:",
      error && error.message
    );
  }
};

// =====================================================
// PUBLIC — GET PUBLISHED BLOGS
// GET /api/blogs
// =====================================================

router.get("/", async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      limit = 20,
      page = 1,
    } = req.query;

    const pageNumber = Math.max(
      parseInt(page, 10) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 20, 1),
      100
    );

    const query = {
      isPublished: true,
    };

    if (String(category).trim()) {
      query.category = String(category).trim();
    }

    if (String(search).trim()) {
      const searchText = String(search).trim();

      query.$or = [
        {
          title: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          excerpt: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          content: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: searchText,
            $options: "i",
          },
        },
      ];
    }

    const skip =
      (pageNumber - 1) * limitNumber;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({
          publishDate: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      Blog.countDocuments(query),
    ]);

    return res.json({
      success: true,
      blogs,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(
        total / limitNumber
      ),
    });
  } catch (error) {
    console.error(
      "GET /api/blogs error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load blogs",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
});

// =====================================================
// ADMIN — GET ALL BLOGS
// IMPORTANT: Keep this BEFORE /:id
// GET /api/blogs/admin/all
// =====================================================

router.get(
  "/admin/all",
  adminAuth,
  async (req, res) => {
    try {
      const search =
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : "";

      const query = {};

      if (search) {
        query.$or = [
          {
            title: {
              $regex: search,
              $options: "i",
            },
          },
          {
            excerpt: {
              $regex: search,
              $options: "i",
            },
          },
          {
            author: {
              $regex: search,
              $options: "i",
            },
          },
          {
            category: {
              $regex: search,
              $options: "i",
            },
          },
          {
            tags: {
              $regex: search,
              $options: "i",
            },
          },
        ];
      }

      const blogs = await Blog.find(query)
        .sort({
          createdAt: -1,
          publishDate: -1,
        })
        .lean();

      return res.json({
        success: true,
        blogs,
        total: blogs.length,
      });
    } catch (error) {
      console.error(
        "GET /api/blogs/admin/all error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to load blogs",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      });
    }
  }
);

// =====================================================
// ADMIN — CREATE BLOG
// POST /api/blogs
// =====================================================

router.post(
  "/",
  adminAuth,
  upload.single("featuredImage"),
  async (req, res) => {
    try {
      const {
        title,
        excerpt,
        content,
        author,
        category,
        tags,
        publishDate,
        isPublished,
      } = req.body;

      if (!title || !String(title).trim()) {
        cleanupUploadedFile(req.file);

        return res.status(400).json({
          success: false,
          message: "Blog title is required",
        });
      }

      if (!content || !String(content).trim()) {
        cleanupUploadedFile(req.file);

        return res.status(400).json({
          success: false,
          message: "Blog content is required",
        });
      }

      const published =
        parseBoolean(isPublished);

      const blogData = {
        title: String(title).trim(),

        excerpt: excerpt
          ? String(excerpt).trim()
          : "",

        content: String(content).trim(),

        author:
          author && String(author).trim()
            ? String(author).trim()
            : "PlutoAstro",

        category:
          category && String(category).trim()
            ? String(category).trim()
            : "Astrology",

        tags: parseTags(tags),

        isPublished: published,
      };

      if (publishDate) {
        const parsedDate =
          new Date(publishDate);

        if (!Number.isNaN(parsedDate.getTime())) {
          blogData.publishDate =
            parsedDate;
        }
      }

      if (
        published &&
        !blogData.publishDate
      ) {
        blogData.publishDate = new Date();
      }

      // Uploaded just now — needed to clean up the Cloudinary
      // asset if blog creation fails below.
      let uploadedPublicId = null;

      if (req.file) {
        try {
          const uploadedImage =
            await uploadBlogImageToCloudinary(req.file);

          blogData.featuredImage =
            uploadedImage.secure_url;

          blogData.featuredImagePublicId =
            uploadedImage.public_id;

          uploadedPublicId =
            uploadedImage.public_id;
        } catch (uploadError) {
          console.error(
            "POST /api/blogs image upload error:",
            uploadError
          );

          return res.status(500).json({
            success: false,
            message:
              uploadError.message ||
              "Image upload failed. Please try again.",
          });
        }
      }

      const blog =
        await Blog.create(blogData);

      return res.status(201).json({
        success: true,
        message: "Blog created successfully",
        blog,
      });
    } catch (error) {
      console.error(
        "POST /api/blogs error:",
        error
      );

      // Remove the just-uploaded Cloudinary asset if the blog
      // could not be created (prevents orphaned uploads).
      if (uploadedPublicId) {
        cloudinary.uploader
          .destroy(uploadedPublicId)
          .catch((destroyError) =>
            console.warn(
              "Could not clean up orphaned Cloudinary upload:",
              destroyError && destroyError.message
            )
          );
      }

      cleanupUploadedFile(req.file);

      return res.status(500).json({
        success: false,
        message: "Failed to create blog",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      });
    }
  }
);

// =====================================================
// ADMIN — UPDATE BLOG
// PUT /api/blogs/:id
// =====================================================

router.put(
  "/:id",
  adminAuth,
  upload.single("featuredImage"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        cleanupUploadedFile(req.file);

        return res.status(400).json({
          success: false,
          message: "Invalid blog ID",
        });
      }

      const blog =
        await Blog.findById(id);

      if (!blog) {
        cleanupUploadedFile(req.file);

        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      const {
        title,
        excerpt,
        content,
        author,
        category,
        tags,
        publishDate,
        isPublished,
      } = req.body;

      if (title !== undefined) {
        if (!String(title).trim()) {
          cleanupUploadedFile(req.file);

          return res.status(400).json({
            success: false,
            message: "Blog title is required",
          });
        }

        blog.title =
          String(title).trim();
      }

      if (content !== undefined) {
        if (!String(content).trim()) {
          cleanupUploadedFile(req.file);

          return res.status(400).json({
            success: false,
            message: "Blog content is required",
          });
        }

        blog.content =
          String(content).trim();
      }

      if (excerpt !== undefined) {
        blog.excerpt =
          String(excerpt).trim();
      }

      if (author !== undefined) {
        blog.author =
          String(author).trim() ||
          "PlutoAstro";
      }

      if (category !== undefined) {
        blog.category =
          String(category).trim() ||
          "Astrology";
      }

      if (tags !== undefined) {
        blog.tags = parseTags(tags);
      }

      if (publishDate !== undefined) {
        if (publishDate) {
          const parsedDate =
            new Date(publishDate);

          if (
            !Number.isNaN(
              parsedDate.getTime()
            )
          ) {
            blog.publishDate =
              parsedDate;
          }
        } else {
          blog.publishDate = null;
        }
      }

      if (isPublished !== undefined) {
        const wasPublished =
          !!blog.isPublished;

        blog.isPublished =
          parseBoolean(isPublished);

        if (
          !wasPublished &&
          blog.isPublished &&
          !blog.publishDate
        ) {
          blog.publishDate =
            new Date();
        }
      }

      // Previous image details (captured before overwriting) and
      // the new upload's public_id (for orphan cleanup on failure).
      let previousImage = null;
      let previousImagePublicId = null;
      let uploadedPublicId = null;

      if (req.file) {
        try {
          const uploadedImage =
            await uploadBlogImageToCloudinary(req.file);

          previousImage = blog.featuredImage;
          previousImagePublicId = blog.featuredImagePublicId;

          blog.featuredImage =
            uploadedImage.secure_url;

          blog.featuredImagePublicId =
            uploadedImage.public_id;

          uploadedPublicId =
            uploadedImage.public_id;
        } catch (uploadError) {
          console.error(
            "PUT /api/blogs/:id image upload error:",
            uploadError
          );

          return res.status(500).json({
            success: false,
            message:
              uploadError.message ||
              "Image upload failed. Please try again.",
          });
        }
      }

      await blog.save();

      // The old asset is deleted only AFTER the new image is
      // safely saved, so a failed save never leaves the blog
      // without its featured image.
      if (previousImage || previousImagePublicId) {
        destroyOldBlogImage({
          imageUrl: previousImage,
          publicId: previousImagePublicId,
        });
      }

      return res.json({
        success: true,
        message: "Blog updated successfully",
        blog,
      });
    } catch (error) {
      console.error(
        "PUT /api/blogs/:id error:",
        error
      );

      // Remove the just-uploaded Cloudinary asset if the blog
      // could not be saved (prevents orphaned uploads).
      if (uploadedPublicId) {
        cloudinary.uploader
          .destroy(uploadedPublicId)
          .catch((destroyError) =>
            console.warn(
              "Could not clean up orphaned Cloudinary upload:",
              destroyError && destroyError.message
            )
          );
      }

      cleanupUploadedFile(req.file);

      return res.status(500).json({
        success: false,
        message: "Failed to update blog",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      });
    }
  }
);

// =====================================================
// ADMIN — PUBLISH / UNPUBLISH
// PATCH /api/blogs/:id/publish
// =====================================================

router.patch(
  "/:id/publish",
  adminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid blog ID",
        });
      }

      const blog =
        await Blog.findById(id);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      const requestedStatus =
        req.body &&
        req.body.isPublished !== undefined
          ? parseBoolean(
              req.body.isPublished
            )
          : !blog.isPublished;

      blog.isPublished =
        requestedStatus;

      if (
        requestedStatus &&
        !blog.publishDate
      ) {
        blog.publishDate =
          new Date();
      }

      await blog.save();

      return res.json({
        success: true,
        message: requestedStatus
          ? "Blog published successfully"
          : "Blog unpublished successfully",
        blog,
      });
    } catch (error) {
      console.error(
        "PATCH /api/blogs/:id/publish error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update publish status",
      });
    }
  }
);

// =====================================================
// ADMIN — DELETE BLOG
// DELETE /api/blogs/:id
// =====================================================

router.delete(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid blog ID",
        });
      }

      const blog =
        await Blog.findById(id);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      const imageUrl =
        blog.featuredImage;

      const imagePublicId =
        blog.featuredImagePublicId;

      await Blog.findByIdAndDelete(id);

      if (imageUrl || imagePublicId) {
        destroyOldBlogImage({
          imageUrl,
          publicId: imagePublicId,
        });
      }

      return res.json({
        success: true,
        message: "Blog deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE /api/blogs/:id error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to delete blog",
      });
    }
  }
);

// =====================================================
// PUBLIC — GET SINGLE PUBLISHED BLOG
// GET /api/blogs/:idOrSlug
// Accepts either a Mongo _id or a slug (same pattern as
// productRoutes.js) so /blog/:slug detail pages work.
// =====================================================

router.get(
  "/:idOrSlug",
  async (req, res) => {
    try {
      const { idOrSlug } = req.params;

      const slugParam = String(idOrSlug).toLowerCase();

      const query = {
        isPublished: true,
      };

      if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        query.$or = [
          { _id: idOrSlug },
          { slug: slugParam },
        ];
      } else {
        query.slug = slugParam;
      }

      const blog =
        await Blog.findOne(query).lean();

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      return res.json({
        success: true,
        blog,
      });
    } catch (error) {
      console.error(
        "GET /api/blogs/:idOrSlug error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to load blog",
      });
    }
  }
);

// =====================================================
// ERROR HANDLER
// =====================================================

router.use(
  (error, req, res, next) => {
    console.error(
      "Blog route error:",
      error
    );

    if (
      error instanceof multer.MulterError
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "Image size must be less than 5MB"
            : error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Blog request failed",
      });
    }

    next();
  }
);

module.exports = router;