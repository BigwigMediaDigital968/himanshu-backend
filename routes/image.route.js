const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = require("../config/storage");
const upload = multer({ storage });

const {
  uploadImages,
  getImages,
  deleteImage,
} = require("../controllers/image.controller");

/* Upload images */
router.post("/upload", upload.array("images", 10), uploadImages);

/* Get images */
router.get("/", getImages);

/* Delete image */
router.delete("/:id", deleteImage);

module.exports = router;
