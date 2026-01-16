const Featured = require("../models/featured.model");
const cloudinary = require("../config/cloudinary");

/* ---------------- UPLOAD FEATURED ITEM ---------------- */
exports.uploadFeatured = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const { title, link } = req.body;

    if (!title || !link) {
      return res.status(400).json({ 
        message: "Title and link are required" 
      });
    }

    // Validate link format (basic URL validation)
    try {
      new URL(link);
    } catch (error) {
      return res.status(400).json({ 
        message: "Invalid link format. Please provide a valid URL" 
      });
    }

    const featuredItem = new Featured({
      image: {
        url: req.file.path, // Cloudinary secure URL
        publicId: req.file.filename, // Cloudinary public_id
      },
      title: title,
      link: link,
    });

    const savedItem = await featuredItem.save();

    res.status(201).json({
      message: "Featured item uploaded successfully",
      data: savedItem,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- GET ALL FEATURED ITEMS ---------------- */
exports.getFeatured = async (req, res) => {
  try {
    const featuredItems = await Featured.find().sort({ createdAt: -1 });
    res.status(200).json(featuredItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------------- DELETE FEATURED ITEM ---------------- */
exports.deleteFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find featured item in DB
    const featuredItem = await Featured.findById(id);
    if (!featuredItem) {
      return res.status(404).json({ message: "Featured item not found" });
    }

    // 2. Delete image from Cloudinary (if publicId exists)
    if (featuredItem.image.publicId) {
      await cloudinary.uploader.destroy(featuredItem.image.publicId);
    }

    // 3. Delete from DB
    await Featured.findByIdAndDelete(id);

    res.status(200).json({ message: "Featured item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
