const express = require("express");
const cors = require("cors");
const { connect } = require("./config/db");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", require("./routes/subscriber.route"));
app.use("/appointment", require("./routes/appointment.route"));
app.use("/info", require("./routes/info.route"));
app.use("/blog", require("./routes/blog.route"));
app.use("/gallery", require("./routes/image.route"));
app.use("/featured", require("./routes/featured.route"));

// Start server
app.listen(process.env.PORT, async () => {
  try {
    await connect();
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }

  console.log(`🚀 Server is listening on port ${process.env.PORT}`);
});
