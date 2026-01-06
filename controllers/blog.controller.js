const BlogPost = require("../models/blog.model");

/* ================= CREATE BLOG ================= */
exports.addBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, author, tags, schemaMarkup } =
      req.body;

    if (!req.file || (!req.file.path && !req.file.secure_url)) {
      return res.status(400).json({ error: "Cover image is required." });
    }

    if (!content || typeof content !== "string") {
      return res
        .status(400)
        .json({ error: "Blog content (HTML) is required." });
    }

    const coverImage = req.file.secure_url || req.file.path;

    let schemaArray = [];
    if (schemaMarkup) {
      schemaArray = Array.isArray(schemaMarkup) ? schemaMarkup : [schemaMarkup];
    }

    const blogPost = new BlogPost({
      title,
      slug,
      excerpt,
      content,
      author,
      tags: tags?.split(",").map((tag) => tag.trim()),
      coverImage,
      schemaMarkup: schemaArray,
    });

    await blogPost.save();

    res.status(201).json({
      message: "Blog post created successfully",
      blogPost,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* ================= GET ALL BLOGS ================= */
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogPost.find().sort({ datePublished: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Fetch blogs error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================= UPDATE BLOG ================= */
exports.updateBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, content, author, excerpt, tags, schemaMarkup } = req.body;

    const updateFields = {
      ...(title && { title }),
      ...(content && { content }),
      ...(author && { author }),
      ...(excerpt && { excerpt }),
      ...(tags && { tags: tags.split(",").map((t) => t.trim()) }),
      ...(schemaMarkup && { schemaMarkup }),
      lastUpdated: new Date(),
    };

    if (req.file && (req.file.secure_url || req.file.path)) {
      updateFields.coverImage = req.file.secure_url || req.file.path;
    }

    const updatedBlog = await BlogPost.findOneAndUpdate(
      { slug },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ msg: "Blog post not found" });
    }

    res.status(200).json({
      msg: "Blog post updated successfully",
      blogPost: updatedBlog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================= DELETE BLOG ================= */
exports.deleteBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    const deletedBlog = await BlogPost.findOneAndDelete({ slug });

    if (!deletedBlog) {
      return res.status(404).json({ msg: "Blog post not found" });
    }

    res.status(200).json({ msg: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ================= UPDATE COVER IMAGE ================= */
exports.updateCoverImage = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const imageUrl = req.file.secure_url || req.file.path;

    const updatedBlog = await BlogPost.findOneAndUpdate(
      { slug },
      {
        coverImage: imageUrl,
        lastUpdated: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Cover image updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Update image error:", error);
    res.status(500).json({ message: "Error updating cover image" });
  }
};

/* ================= RELATED BLOGS ================= */
exports.getRelatedBlogs = async (req, res) => {
  try {
    const { slug } = req.params;

    const currentBlog = await BlogPost.findOne({ slug });
    if (!currentBlog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    const tags = currentBlog.tags || [];
    let relatedBlogs = [];

    if (tags.length) {
      relatedBlogs = await BlogPost.find({
        slug: { $ne: slug },
        tags: { $in: tags },
      })
        .sort({ datePublished: -1 })
        .limit(4);
    }

    if (!relatedBlogs.length) {
      relatedBlogs = await BlogPost.find({ slug: { $ne: slug } })
        .sort({ datePublished: -1 })
        .limit(4);
    }

    res.status(200).json(relatedBlogs);
  } catch (error) {
    console.error("Related blog error:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};
