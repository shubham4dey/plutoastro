const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const openaiRoutes = require("./routes/openaiRoutes");
const astrologerRoutes = require("./routes/astrologerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const horoscopeRoutes = require("./routes/horoscopeRoutes");
const authRoutes = require("./routes/authRoutes");
const aiAstrologerRoutes = require("./routes/aiAstrologerRoutes");
const astrologerApplicationRoutes = require("./routes/astrologerApplicationRoutes");
const productRoutes = require("./routes/productRoutes"); 
const newsletterRoutes = require("./routes/newsletterRoutes");

// ✅ 1. YEH LINE ADD KI HAI
const astrologerDashboardRoutes = require("./routes/astrologerDashboardRoutes");

const app = express();

/* =========================
   CORS (PRODUCTION READY)
========================= */
app.use(
  cors({
    origin: [
      "https://plutoastro.com",
      "https://www.plutoastro.com",
      "http://localhost:3000",
      "https://plutoastro-h2aqh5da6-shubham4deys-projects.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

/* =========================
   BODY PARSER
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   UPLOADS STATIC FOLDER
========================= */
const uploadsPath = path.resolve(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

console.log("📁 Uploads Path:", uploadsPath);
console.log("📁 Upload Folder Exists:", fs.existsSync(uploadsPath));

app.use("/uploads", (req, res, next) => {
  const filePath = path.join(uploadsPath, req.path);
  console.log("📸 Upload Request:", req.originalUrl);
  console.log("📄 Requested File:", filePath);
  console.log("✅ File Exists:", fs.existsSync(filePath));
  next();
});

app.use(
  "/uploads",
  express.static(uploadsPath, {
    index: false,
    extensions: ["png", "jpg", "jpeg", "gif", "webp", "jfif"],
  })
);

/* =========================
   TEST ROUTES
========================= */
app.get("/test-upload", (req, res) => {
  res.json({ success: true, uploadsPath, folderExists: fs.existsSync(uploadsPath) });
});

app.get("/test-file/:filename", (req, res) => {
  const filePath = path.join(uploadsPath, req.params.filename);
  res.json({ success: true, file: req.params.filename, exists: fs.existsSync(filePath), path: filePath });
});

/* =========================
   API ROUTES
========================= */
app.use(openaiRoutes); 
app.use("/api/admin", adminRoutes);
app.use("/api/astrologers", astrologerRoutes);
app.use("/api/horoscope", horoscopeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai-astrologers", aiAstrologerRoutes);
app.use("/api/astrologer-applications", astrologerApplicationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/newsletter", newsletterRoutes);

// ✅ 2. YEH LINE ADD KI HAI (Astrologer Login/Dashboard ke liye)
app.use("/api/astrologer-dashboard", astrologerDashboardRoutes);

/* =========================
   ROOT ROUTE
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 PlutoAstro API Running Successfully on Render",
    uploads: "/uploads/<filename>",
  });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  console.log("❌ Route Not Found:", req.originalUrl);
  res.status(404).json({ success: false, message: "Route Not Found", route: req.originalUrl });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;