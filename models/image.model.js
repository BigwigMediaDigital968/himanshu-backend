const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      //   required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["DR. Himanshu", "AVF care", "Podcast"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
