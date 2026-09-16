// server/scripts/seedBlogs.js
// Run with: npm run seed:blogs
// Seeds a few sample published blogs so the homepage Latest Blogs section
// has content on a fresh database.

require("dotenv").config();

const mongoose = require("mongoose");
const Blog = require("../models/Blog");

const blogs = [
  {
    title: "Planetary Transits in 2026: What the Stars Have in Store for You",
    excerpt:
      "Saturn and Jupiter shift signs this year, rewiring careers, relationships and karma. Here is your complete 2026 transit guide.",
    content:
      "Every year the sky writes a new story, and 2026 is one of the most dynamic chapters in recent memory.\n\nSaturn's move into sidereal Aries pushes every sign to take personal responsibility. Relationships either deepen or dissolve and careers reward bold, disciplined action.\n\nJupiter in Taurus brings comfort, growth in savings, real estate and food industries and a strong urge for emotional stability. When Jupiter harmonises with Saturn in April, expect serious long-term plans to finally receive green signals.\n\nYour transits can only do so much - how you respond to them decides the outcome. Keep a transit journal this year and watch your patterns transform.",
    author: "PlutoAstro Team",
    category: "Transits",
    tags: ["Transits", "2026", "Saturn", "Jupiter"],
    isPublished: true
  },
  {
    title: "The Power of Rudraksha: A Beginner's Guide to Sacred Beads",
    excerpt:
      "Why do astrologers prescribe Rudraksha? Learn about the 5 Mukhi, 7 Mukhi and how to wear these sacred beads correctly.",
    content:
      "Rudraksha beads have been worn for thousands of years as tools of protection, focus and spiritual growth.\n\nThe five Mukhi Rudraksha represents Lord Shiva and is considered the most balanced bead for overall wellbeing. The seven Mukhi is associated with prosperity while the nine Mukhi is often recommended for strong planetary afflictions.\n\nTo get the best results, energise your bead on a Monday with mantra chanting, string it in a silver or red thread and wear it close to the skin. Avoid wearing it during eating of non-vegetarian food traditionally.\n\nAlways buy Rudraksha from trusted sources and get it energised by a qualified Vedic priest for maximum benefit.",
    author: "PlutoAstro Team",
    category: "Vedic Remedies",
    tags: ["Rudraksha", "Vedic", "Gems", "Remedies"],
    isPublished: true
  },
  {
    title: "Rising Signs Explained: Why Your Sun Sign is Only Half the Story",
    excerpt:
      "Your Ascendant shapes how the world sees you. Understand the 12 rising signs and their secret influence on your life.",
    content:
      "Ask a Vedic astrologer what your most important placement is and they will almost always answer - your Lagna, or rising sign.\n\nWhile your Sun sign describes your inner core, the rising sign describes the mask you wear, your physical body and your first instinct in any situation.\n\nA Leo rising commands attention the moment they walk into a room, while a Virgo rising naturally notices details others miss. A Scorpio rising holds intense, magnetic energy and a Pisces rising looks at the world with dreamy, compassionate eyes.\n\nTo find your rising sign, you need your exact time of birth. This is why guessing your chart with only a date of birth gives you only half the picture.",
    author: "PlutoAstro Team",
    category: "Astrology Basics",
    tags: ["Rising Sign", "Lagna", "Birth Chart", "Astrology"],
    isPublished: true
  }
];

const seedBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Blog.deleteMany({});
    console.log("🗑️  Cleared existing blogs");

    await Blog.insertMany(blogs);
    console.log(`✅ ${blogs.length} blogs seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding blogs:", error);
    process.exit(1);
  }
};

seedBlogs();