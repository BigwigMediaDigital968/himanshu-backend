// config/storage.js
const path = require("path");
const crypto = require("crypto");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Build a collision-proof public_id: strip only the real extension
// (filenames like "WhatsApp Image 2026-08-31 at 11.20.15 AM.jpeg" contain
// periods before the extension, so naively splitting on "." truncates the
// name and causes same-hour uploads to overwrite each other in Cloudinary),
// sanitize it, and append a unique suffix.
const buildPublicId = (originalname) => {
  const base = path
    .parse(originalname)
    .name.trim()
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .replace(/\s+/g, "-");
  const unique = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  return `${base}-${unique}`;
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // 📄 PDF
    if (file.mimetype === "application/pdf") {
      return {
        folder: "himanshu/reports",
        resource_type: "raw",
        format: "pdf",
        public_id: buildPublicId(file.originalname),
      };
    }

    // 🖼️ Images
    return {
      folder: "himanshu/images",
      resource_type: "auto", // SAME AS WORKING PROJECT
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: buildPublicId(file.originalname),
    };
  },
});

module.exports = storage;
