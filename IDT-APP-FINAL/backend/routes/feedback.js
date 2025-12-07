const express = require("express");
const router = express.Router();

let feedbacks = [];

// ---------------------------------------
// ADD FEEDBACK
// ---------------------------------------
router.post("/", (req, res) => {
  const { name, dept, message, time } = req.body;

  const newFeedback = {
    name,
    dept,
    message,
    time: time || new Date().toLocaleString()
  };

  feedbacks.unshift(newFeedback);

  res.json({ success: true, feedback: newFeedback });
});

// ---------------------------------------
// GET ALL FEEDBACK
// ---------------------------------------
router.get("/", (req, res) => {
  res.json(feedbacks);
});

// ---------------------------------------
// CLEAR ALL FEEDBACK (REAL DELETE)
// ---------------------------------------
router.delete("/clear", (req, res) => {
  try {
    feedbacks = [];   // just clear array

    console.log("All feedback cleared!");
    res.json({ success: true, message: "All feedback cleared" });

  } catch (err) {
    console.error("Error clearing feedback:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;

