const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const Blog = require("../models/Blog");

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
// =====================================================

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const safeName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .substring(0, 60);

    cb(
      null,
      `${Date.now()}-${safeName}${ext}`
    );
  },
});

const upload = multer({
  storage,

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

const getImageUrl = (req, file) => {
  if (!file) return "";

  const baseUrl =
    process.env.SERVER_URL ||
    process.env.BACKEND_URL ||
    `${req.protocol}://${req.get("host")}`;

  return `${baseUrl}/uploads/blogs/${file.filename}`;
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

      if (req.file) {
        blogData.featuredImage =
          getImageUrl(req, req.file);
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

      if (req.file) {
        const oldImage =
          blog.featuredImage;

        blog.featuredImage =
          getImageUrl(req, req.file);

        if (oldImage) {
          deleteLocalImage(oldImage);
        }
      }

      await blog.save();

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

      await Blog.findByIdAndDelete(id);

      if (imageUrl) {
        deleteLocalImage(imageUrl);
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