/**
 * Removes leftover records created by the E2E image-upload test runs
 * (scripts/testImageUploadFlow.js) — astrologer applications with an
 * e2e-app-*@plutoastro.local email — and destroys their Cloudinary assets.
 *
 * Usage: node scripts/cleanupE2eData.js
 */

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

require("dns").setServers(["8.8.8.8", "8.8.4.4"]);

// Load server/.env BEFORE cloudinary.js is required, so the Cloudinary
// credentials are available for asset deletion.
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const envContent = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const envValue = (key) =>
  (envContent.match(new RegExp(`^${key}\\s*=\\s*(.+)\\s*$`, "m")) || [])[1];

const MONGO_URI = envValue("MONGO_URI");

// Optional: public_ids passed on the command line are destroyed as well
// (useful to clean up orphaned assets from earlier test runs).
const extraPublicIds = process.argv.slice(2);

(async () => {
  if (!MONGO_URI) {
    console.log("MONGO_URI missing in server/.env");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 20000 });

  const AstrologerApplication = require("../models/AstrologerApplication");
  const { destroyCloudinaryAsset } = require("../utils/cloudinaryUpload");

  const leftovers = await AstrologerApplication.find({
    email: { $regex: "^e2e-app-", $options: "i" },
  });

  for (const record of leftovers) {
    if (record.imagePublicId) {
      await destroyCloudinaryAsset(record.imagePublicId);
    }
    await AstrologerApplication.findByIdAndDelete(record._id);
    console.log(`removed e2e application ${record.email}`);
  }

  for (const publicId of extraPublicIds) {
    await destroyCloudinaryAsset(publicId);
    console.log(`removed leftover Cloudinary asset ${publicId}`);
  }

  console.log(`cleanup done — ${leftovers.length} record(s) removed`);
  await mongoose.connection.close();
  process.exit(0);
})();
