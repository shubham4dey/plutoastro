const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

const products = [
  {
    name: "Birth Chart Reading",
    description: "Get your personalized natal chart with detailed planetary positions and life predictions.",
    image: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f0?w=300&h=300&fit=crop",
    category: "Western",
    price: 49.99,
    stock: 100,
    isActive: true,
    buttonText: "GET READING"
  },
  {
    name: "Tarot Card Deck",
    description: "Premium Rider-Waite tarot deck for accurate readings and spiritual guidance.",
    image: "https://images.unsplash.com/photo-1600609842388-3e4b0c2e3b1a?w=300&h=300&fit=crop",
    category: "Tarot",
    price: 29.99,
    stock: 50,
    isActive: true,
    buttonText: "SHOP NOW"
  },
  {
    name: "Crystal Healing Set",
    description: "Authentic amethyst, rose quartz & clear quartz for energy balancing and meditation.",
    image: "https://images.unsplash.com/photo-1612438214708-f428a707dd0e?w=300&h=300&fit=crop",
    category: "Crystals",
    price: 39.99,
    stock: 75,
    isActive: true,
    buttonText: "BUY NOW"
  },
  {
    name: "Zodiac Jewelry",
    description: "Elegant 925 silver zodiac sign pendants and rings for daily cosmic connection.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop",
    category: "Jewelry",
    price: 59.99,
    stock: 30,
    isActive: true,
    buttonText: "EXPLORE"
  },
  {
    name: "Astrology Books",
    description: "Bestselling guides on Western astrology, transits, and horoscope interpretation.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
    category: "Books",
    price: 24.99,
    stock: 200,
    isActive: true,
    buttonText: "BROWSE"
  },
  {
    name: "Moon Phase Calendar",
    description: "2026 lunar calendar with rituals, manifestations and cosmic events tracker.",
    image: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=300&h=300&fit=crop",
    category: "Western",
    price: 19.99,
    stock: 150,
    isActive: true,
    buttonText: "ORDER NOW"
  },
  {
    name: "Rudraksha Mala",
    description: "Original 5 Mukhi Rudraksha beads for peace, protection and spiritual growth.",
    image: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=300&h=300&fit=crop",
    category: "Indian",
    price: 34.99,
    stock: 100,
    isActive: true,
    buttonText: "CHECK NOW"
  },
  {
    name: "Vedic Yantra",
    description: "Energized Sri Yantra for prosperity, abundance and cosmic alignment.",
    image: "https://images.unsplash.com/photo-1609234656388-0ff3633c373f?w=300&h=300&fit=crop",
    category: "Indian",
    price: 44.99,
    stock: 80,
    isActive: true,
    buttonText: "CHECK NOW"
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    await Product.insertMany(products);
    console.log("✅ Products seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();