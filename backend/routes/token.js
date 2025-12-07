const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "tokens.json");

// Load tokens from file
let tokens = [];
if (fs.existsSync(filePath)) {
    try {
        tokens = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
        tokens = [];
    }
}

// Save tokens to file
function saveTokens() {
    fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2));
}

/* ============================
   GET ALL TOKENS
============================ */
router.get("/", (req, res) => {
    res.json(tokens);
});

/* ============================
   ADD NEW TOKEN
============================ */
router.post("/", (req, res) => {
    const { name, dept, status } = req.body;

    const newToken = {
        tokenNumber: tokens.length > 0 ? tokens[tokens.length - 1].tokenNumber + 1 : 1,
        name,
        dept,
        status: status || "pending",
        time: new Date().toLocaleString()
    };

    tokens.unshift(newToken); // add to top
    saveTokens();

    res.json({ success: true, token: newToken });
});

/* ============================
   UPDATE TOKEN STATUS (IMPORTANT FIX)
============================ */
router.patch("/:tokenNumber", (req, res) => {
    const tokenNumber = parseInt(req.params.tokenNumber);
    const { status } = req.body;

    const index = tokens.findIndex(t => t.tokenNumber === tokenNumber);
    if (index === -1) {
        return res.status(404).json({ success: false, message: "Token not found" });
    }

    tokens[index].status = status.toLowerCase();
    saveTokens();

    res.json({ success: true, token: tokens[index] });
});

/* ============================
   CLEAR ALL TOKENS
============================ */
router.delete("/clear", (req, res) => {
    tokens = [];
    saveTokens();
    res.json({ success: true, message: "All tokens cleared" });
});

module.exports = router;

