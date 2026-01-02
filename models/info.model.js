const mongoose = require("mongoose");

const infoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    images: [
      {
        url: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Info", infoSchema);
