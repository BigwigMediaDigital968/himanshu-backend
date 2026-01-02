const express = require("express");
const router = express.Router();

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

// GET: fetch all appointments (admin)
router.get("/", getAllAppointments);

router.put("/:id/mark", updateAppointmentStatus);
router.delete("/:id", deleteAppointment);

module.exports = router;
