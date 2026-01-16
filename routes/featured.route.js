const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = require("../config/storage");
const upload = multer({ storage });

const {
  uploadFeatured,
  getFeatured,
  deleteFeatured,
} = require("../controllers/featured.controller");

/* Upload featured item */
router.post("/upload", upload.single("image"), uploadFeatured);

/* Get all featured items */
router.get("/", getFeatured);

/* Delete featured item */
router.delete("/:id", deleteFeatured);

module.exports = router;
