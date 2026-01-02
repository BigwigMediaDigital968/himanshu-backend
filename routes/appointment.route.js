const express = require("express");
const router = express.Router();

const { createAppointment } = require("../controllers/appointment.controller");
const multer = require("multer");
const storage = require("../config/storage"); // Cloudinary storage

const upload = multer({ storage });

// single PDF upload
router.post("/", upload.single("report"), createAppointment);

module.exports = router;
