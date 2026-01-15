const Image = require("../models/image.model");
const cloudinary = require("../config/cloudinary");

/* ---------------- UPLOAD IMAGES ---------------- */
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const images = req.files.map((file) => ({
      url: file.path, // Cloudinary secure URL
      publicId: file.filename, // Cloudinary public_id
    }));

    const savedImages = await Image.insertMany(images);

    res.status(201).json({
      message: "Images uploaded successfully",
      images: savedImages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- GET IMAGES (DISPLAY PAGE) ---------------- */
exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find image in DB
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // 2. Delete from Cloudinary (if publicId exists)
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    // 3. Delete from DB
    await Image.findByIdAndDelete(id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
