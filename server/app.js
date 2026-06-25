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
const app = express();

/* =========================
   CORS
========================= */

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.0.113:3000",
    ],
    credentials: true,
  })
);

/* =========================
   BODY PARSER
========================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================
   UPLOADS STATIC FOLDER
========================= */

const uploadsPath = path.resolve(
  __dirname,
  "uploads"
);

// Create uploads folder automatically
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, {
    recursive: true,
  });
}

console.log(
  "📁 Uploads Path:",
  uploadsPath
);

console.log(
  "📁 Upload Folder Exists:",
  fs.existsSync(uploadsPath)
);

/* =========================
   DEBUG UPLOAD REQUESTS
========================= */

app.use(
  "/uploads",
  (req, res, next) => {
    const filePath = path.join(
      uploadsPath,
      req.path
    );

    console.log(
      "📸 Upload Request:",
      req.originalUrl
    );

    console.log(
      "📄 Requested File:",
      filePath
    );

    console.log(
      "✅ File Exists:",
      fs.existsSync(filePath)
    );

    next();
  }
);

/* =========================
   SERVE STATIC IMAGES
========================= */

app.use(
  "/uploads",
  express.static(
    uploadsPath,
    {
      index: false,
      extensions: [
        "png",
        "jpg",
        "jpeg",
        "gif",
        "webp",
        "jfif",
      ],
    }
  )
);

/* =========================
   TEST ROUTES
========================= */

app.get(
  "/test-upload",
  (req, res) => {
    res.json({
      success: true,
      uploadsPath,
      folderExists:
        fs.existsSync(
          uploadsPath
        ),
    });
  }
);

app.get(
  "/test-file/:filename",
  (req, res) => {
    const filePath =
      path.join(
        uploadsPath,
        req.params.filename
      );

    res.json({
      success: true,
      file:
        req.params.filename,
      exists:
        fs.existsSync(
          filePath
        ),
      path: filePath,
    });
  }
);

/* =========================
   API ROUTES
========================= */

// Gemini / OpenAI
app.use(openaiRoutes);

// Admin APIs
app.use(
  "/api/admin",
  adminRoutes
);

// Human Astrologers APIs
app.use(
  "/api/astrologers",
  astrologerRoutes
);

// Horoscope APIs
app.use(
  "/api/horoscope",
  horoscopeRoutes
);

// Authentication APIs
app.use(
  "/api/auth",
  authRoutes
);

// AI Astrologers APIs
app.use(
  "/api/ai-astrologers",
  aiAstrologerRoutes
);

// Astrologer Applications APIs
app.use(
  "/api/astrologer-applications",
  astrologerApplicationRoutes
);

/* =========================
   ROOT ROUTE
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "🚀 PlutoAstro API Running",
    uploads:
      "/uploads/<filename>",
  });
});

/* =========================
   404 HANDLER
========================= */

app.use(
  (req, res) => {
    console.log(
      "❌ Route Not Found:",
      req.originalUrl
    );

    res.status(404).json({
      success: false,
      message:
        "Route Not Found",
      route:
        req.originalUrl,
    });
  }
);

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use(
  (
    err,
    req,
    res,
    next
  ) => {
    console.error(
      "🔥 Server Error:",
      err
    );

    res.status(
      err.status || 500
    ).json({
      success: false,
      message:
        err.message ||
        "Internal Server Error",
      stack:
        process.env
          .NODE_ENV ===
        "development"
          ? err.stack
          : undefined,
    });
  }
);

module.exports = app;