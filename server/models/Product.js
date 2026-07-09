const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"]
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    category: {
      type: String,
      required: true,
      enum: ["Western", "Indian", "Vedic", "Tarot", "Crystals", "Books", "Jewelry", "Other"]
    },
    image: {
      type: String,
      required: [true, "Product image is required"]
    },
    images: [
      {
        type: String
      }
    ],
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"]
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    features: [
      {
        type: String
      }
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0
    },
    buttonText: {
      type: String,
      default: "VIEW DETAILS"
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate slug from name
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 80);
  }
  next();
});

productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);