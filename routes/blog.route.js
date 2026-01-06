const router = require("express").Router();
const multer = require("multer");

const storage = require("../config/storage");
const upload = multer({ storage });

const blogController = require("../controllers/blog.controller");

/* ================= ROUTES ================= */

router.post("/add", upload.single("coverImage"), blogController.addBlog);

router.get("/viewblog", blogController.getAllBlogs);

router.put("/:slug", upload.single("coverImage"), blogController.updateBlog);

router.delete("/:slug", blogController.deleteBlog);

router.patch(
  "/:slug/image",
  upload.single("coverImage"),
  blogController.updateCoverImage
);

router.get("/related/:slug", blogController.getRelatedBlogs);

module.exports = router;
