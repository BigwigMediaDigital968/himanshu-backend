const express = require("express");
const router = express.Router();
const {
  subscribe,
  getSubscribers,
  unsubscribe,
} = require("../controllers/subscriber.controller");

// Subscribe to newsletter
router.post("/subscribe", subscribe);

// Get all subscribers (admin/testing)
router.get("/subscribers", getSubscribers);

router.delete("/subscribe/:email", unsubscribe);

module.exports = router;
