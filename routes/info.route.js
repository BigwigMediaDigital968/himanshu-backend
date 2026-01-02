const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../config/storage");

const upload = multer({ storage });

const {
  createInfo,
  updateInfo,
  getAllInfo,
  deleteInfo,
} = require("../controllers/info.controller");

router.post("/", upload.array("images", 5), createInfo);
router.put("/:id", upload.array("images", 5), updateInfo);
router.get("/", getAllInfo);
router.delete("/:id", deleteInfo);

module.exports = router;
