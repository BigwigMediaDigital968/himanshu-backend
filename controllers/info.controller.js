const Info = require("../models/info.model");

exports.createInfo = async (req, res) => {
  try {
    const { title, description } = req.body;

    const images = req.files
      ? req.files.map((file) => ({ url: file.path }))
      : [];

    const info = await Info.create({
      title,
      description,
      images,
    });

    res.status(201).json({ success: true, data: info });
  } catch (err) {
    res.status(500).json({ success: false, message: "Create failed" });
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const { title, description } = req.body;

    const update = { title, description };

    if (req.files?.length) {
      update.images = req.files.map((file) => ({ url: file.path }));
    }

    const info = await Info.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    res.json({ success: true, data: info });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

exports.getAllInfo = async (req, res) => {
  const data = await Info.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
};

exports.deleteInfo = async (req, res) => {
  try {
    const info = await Info.findByIdAndDelete(req.params.id);

    if (!info) {
      return res.status(404).json({
        success: false,
        message: "Info not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Info deleted successfully",
    });
  } catch (error) {
    console.error("Delete Info Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete info",
    });
  }
};
