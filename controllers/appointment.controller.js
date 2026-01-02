const Appointment = require("../models/appointment.model");

exports.createAppointment = async (req, res) => {
  try {
    const { name, phone, email, disease, message } = req.body;

    if (!name || !phone || !email || !disease) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let images = [];
    let report = null;

    // 🖼️ Multiple images
    if (req.files?.images) {
      images = req.files.images.map((file) => ({
        url: file.path,
        public_id: file.public_id,
      }));
    }

    // 📄 Single PDF
    if (req.files?.report) {
      report = {
        url: req.files.report[0].path,
        public_id: req.files.report[0].public_id,
      };
    }

    // ❌ Prevent both at once
    if (images.length > 0 && report) {
      return res.status(400).json({
        message: "Upload either images OR a PDF, not both",
      });
    }

    const appointment = await Appointment.create({
      name,
      phone,
      email,
      disease,
      message,
      images, // optional
      report, // optional
    });

    res.status(201).json({
      success: true,
      message: "Appointment submitted successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Create Appointment Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
