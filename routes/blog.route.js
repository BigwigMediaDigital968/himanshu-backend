const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = require("../config/storage");
const upload = multer({ storage });
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const blogController = require("../controllers/blog.controller");

const editorImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "blogs/content",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: `${file.originalname.split(".")[0]}-${Date.now()}`,
  }),
});
const editorUpload = multer({ storage: editorImageStorage });

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

router.post(
  "/upload-editor-image",
  editorUpload.single("image"),
  blogController.uploadEditorImage
);

router.get("/related/:slug", blogController.getRelatedBlogs);

module.exports = router;
