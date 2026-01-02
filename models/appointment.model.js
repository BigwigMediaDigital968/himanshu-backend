const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    disease: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      trim: true,
    },

    // 🖼️ Multiple images (optional)
    images: [
      {
        url: {
          type: String,
        },
      },
    ],

    // 📄 Single PDF (optional)
    report: {
      url: {
        type: String,
      },
    },
    marked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
