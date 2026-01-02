const Appointment = require("../models/appointment.model");

exports.createAppointment = async (req, res) => {
  try {
    const { name, phone, email, disease, message } = req.body;

    if (!name || !phone || !email || !disease) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let reportData = null;

    if (req.file) {
      reportData = {
        url: req.file.path, // ✅ Cloudinary URL
        public_id: req.file.public_id, // ✅ Correct public_id
      };
    }

    const appointment = await Appointment.create({
      name,
      phone,
      email,
      disease,
      message,
      report: reportData,
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
