const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    featuredImage: {
      type: String,
      default: ""
    },
    excerpt: {
      type: String,
      default: "",
      trim: true,
      maxlength: [600, "Excerpt cannot exceed 600 characters"]
    },
    content: {
      type: String,
      required: [true, "Blog content is required"]
    },
    author: {
      type: String,
      default: "PlutoAstro",
      trim: true,
      maxlength: [100, "Author name cannot exceed 100 characters"]
    },
    category: {
      type: String,
      default: "Astrology",
      trim: true,
      maxlength: [100, "Category cannot exceed 100 characters"]
    },
    tags: {
      type: [String],
      default: []
    },
    publishDate: {
      type: Date,
      default: Date.now
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate slug from title only when a slug has not been provided.
// IMPORTANT: this must run on pre("validate"), not pre("save") —
// Mongoose validates BEFORE save hooks, so a pre("save") hook fires
// too late and create() fails with "Path `slug` is required."
blogSchema.pre("validate", async function () {
  if (!this.slug || this.slug.trim() === "") {
    const base =
      this.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 80) || `blog-${Date.now()}`;

    let candidate = base;
    let counter = 1;

    // Guarantee uniqueness (duplicate titles happen in real usage)
    // slug is unique-indexed, so collision would throw E11000 otherwise
    while (
      (await this.constructor.countDocuments({
        slug: candidate,
        ...(this._id ? { _id: { $ne: this._id } } : {}),
      })) > 0
    ) {
      counter += 1;
      candidate = `${base}-${counter}`;
    }

    this.slug = candidate;
  }
});

blogSchema.index({ title: "text", excerpt: "text", content: "text" });

module.exports = mongoose.model("Blog", blogSchema);