const Subscriber = require("../models/subscriber.model");
const sendEmail = require("../utils/sendEmail");

// POST /api/subscribe
exports.subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already subscribed" });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: "✅ Subscription Confirmed – Dr. Himanshu Verma",
      text: "Thank you for subscribing to updates from Dr. Himanshu Verma.",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #0a2540; line-height: 1.6;">
      
      <h2 style="color: #0b8d85; margin-bottom: 12px;">
        Subscription Confirmed
      </h2>

      <p>Dear Subscriber,</p>

      <p>
        Thank you for subscribing to updates from 
        <strong>Dr. Himanshu Verma</strong>, 
        Vascular & Endovascular Surgeon.
      </p>

      <p>
        You will receive carefully curated information related to:
      </p>

      <ul style="padding-left: 18px;">
        <li>Vascular health awareness & prevention tips</li>
        <li>Advancements in minimally invasive treatments</li>
        <li>Clinic updates and patient education resources</li>
      </ul>

      <p>
        Our aim is to keep you informed with reliable, easy-to-understand medical
        insights that support better vascular health.
      </p>

      <hr style="margin: 24px 0; border: none; border-top: 1px solid #e0e0e0;" />

      <p style="font-size: 13px; color: #666;">
        If you did not request this subscription, please ignore this email.
      </p>

      <p style="margin-top: 20px;">
        Warm regards,<br />
        <strong>Dr. Himanshu Verma</strong><br />
        <span style="font-size: 14px; color: #555;">
          Vascular & Endovascular Surgeon
        </span>
      </p>
    </div>
  `,
    });

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.error("Subscribe Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET /api/subscribers (optional)
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    return res.json(subscribers);
  } catch (error) {
    console.error("Get Subscribers Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
