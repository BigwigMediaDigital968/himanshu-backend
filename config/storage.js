// config/storage.js
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // 📄 PDF
    if (file.mimetype === "application/pdf") {
      return {
        folder: "himanshu/reports",
        resource_type: "raw",
        format: "pdf",
        public_id: file.originalname.split(".")[0],
      };
    }

    // 🖼️ Images
    return {
      folder: "himanshu/images",
      resource_type: "auto", // SAME AS WORKING PROJECT
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: file.originalname.split(".")[0],
    };
  },
});

module.exports = storage;
