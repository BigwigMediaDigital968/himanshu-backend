const express = require("express");
const router = express.Router();

const Appointment = require("../models/appointment.model");
const sendEmail = require("../utils/sendEmail");

const {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../controllers/appointment.controller");
const multer = require("multer");
const storage = require("../config/storage");

// Multer instance
const upload = multer({ storage });

// 👇 allow either images[] OR report (pdf)
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 5 }, // multiple images
    { name: "report", maxCount: 1 }, // single pdf
  ]),
  createAppointment
);

const otpMap = new Map();

/**
 * ==========================
 * SEND OTP
 * ==========================
 */
router.post(
  "/send-otp",
  upload.fields([
    { name: "images", maxCount: 5 }, // multiple images
    { name: "report", maxCount: 1 }, // single pdf
  ]),
  async (req, res) => {
    const { name, email, phone, disease, message } = req.body;

    try {
      if (!email || !name || !phone || !disease) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // 1️⃣ Check if appointment already exists
      const existingAppointment = await Appointment.findOne({ email });
      if (existingAppointment) {
        return res.status(400).json({
          message: "Appointment already exists with this email.",
        });
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

      // 2️⃣ Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // 3️⃣ Store OTP + form data + files temporarily
      otpMap.set(email, {
        otp,
        createdAt: Date.now(),
        data: {
          name,
          email,
          phone,
          disease,
          message,
          images,
          report,
        },
      });

      // 4️⃣ Send OTP email
      await sendEmail({
        to: email,
        subject: "🔐 Your OTP for Appointment Verification",
        html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Hello ${name},</h2>
          <p>Your OTP for appointment verification is:</p>
          <h1 style="letter-spacing: 4px; color: #2563eb;">
            ${otp}
          </h1>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>Please do not share this OTP with anyone.</p>
          <br />
          <p>Regards,<br/><strong>AVF Team</strong></p>
        </div>
      `,
      });

      res.status(200).json({ message: "OTP sent to email." });
    } catch (err) {
      console.error("Send OTP Error:", err);
      res.status(500).json({ message: "Error sending OTP." });
    }
  }
);

/**
 * ==========================
 * VERIFY OTP & CREATE APPOINTMENT
 * ==========================
 */
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = otpMap.get(email);

    if (!record) {
      return res.status(400).json({
        message: "OTP expired or not found.",
      });
    }

    // OTP Expiry (10 min)
    if (Date.now() - record.createdAt > 10 * 60 * 1000) {
      otpMap.delete(email);
      return res.status(400).json({ message: "OTP expired." });
    }

    if (parseInt(otp) !== record.otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // 1️⃣ Create appointment
    const appointment = new Appointment({
      ...record.data,
      marked: false,
    });

    await appointment.save();

    otpMap.delete(email);

    // 2️⃣ Confirmation email to user
    await sendEmail({
      to: email,
      subject: "✅ Appointment Request Received",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Hello ${record.data.name},</h2>
          <p>
            Thank you for booking an appointment with us.
            Our team will contact you shortly.
          </p>

          <p><strong>Disease:</strong> ${record.data.disease}</p>

          <br/>
          <p>Regards,<br/><strong>AVF Team</strong></p>
        </div>
      `,
    });

    // 3️⃣ Internal notification email
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "📩 New Appointment Received",
      html: `
        <h3>New Appointment Details</h3>
        <p><strong>Name:</strong> ${record.data.name}</p>
        <p><strong>Email:</strong> ${record.data.email}</p>
        <p><strong>Phone:</strong> ${record.data.phone}</p>
        <p><strong>Disease:</strong> ${record.data.disease}</p>
        <p><strong>Message:</strong> ${record.data.message || "-"}</p>
      `,
    });

    res.status(200).json({
      message: "Appointment confirmed. Confirmation email sent.",
    });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "OTP verification failed." });
  }
});

// GET: fetch all appointments (admin)
router.get("/", getAllAppointments);

router.put("/:id/mark", updateAppointmentStatus);
router.delete("/:id", deleteAppointment);

module.exports = router;
