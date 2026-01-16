const mongoose = require("mongoose");

const featuredSchema = new mongoose.Schema(
  {
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        //required: true,
      },
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Featured", featuredSchema);
