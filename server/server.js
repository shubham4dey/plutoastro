require("dns").setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

/* =========================
   DATABASE
========================= */

connectDB();

/* =========================
   SERVER
========================= */

const PORT =
  process.env.PORT || 5000;

const server = app.listen(
  PORT,
  () => {
    console.log(
      `🚀 Server Running On Port ${PORT}`
    );
  }
);

/* =========================
   HANDLE UNCAUGHT ERRORS
========================= */

process.on(
  "unhandledRejection",
  (err) => {
    console.error(
      "❌ Unhandled Rejection:",
      err.message
    );

    server.close(() => {
      process.exit(1);
    });
  }
);

process.on(
  "uncaughtException",
  (err) => {
    console.error(
      "❌ Uncaught Exception:",
      err.message
    );

    process.exit(1);
  }
);