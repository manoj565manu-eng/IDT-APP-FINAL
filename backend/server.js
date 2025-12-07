const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Paths for token + feedback JSON storage
const DATA_DIR = path.join(__dirname, "data");
const TOKEN_FILE = path.join(DATA_DIR, "tokens.json");
const FEEDBACK_FILE = path.join(DATA_DIR, "feedback.json");

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// Read JSON helper
const readJSON = (file) => {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file));
};

// Write JSON helper
const writeJSON = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// ---------------------------
// TOKEN ROUTES
// ---------------------------
app.get("/api/token", (req, res) => {
    const tokens = readJSON(TOKEN_FILE);
    res.json(tokens);
});

app.post("/api/token", (req, res) => {
    const tokens = readJSON(TOKEN_FILE);
    const newToken = {
        tokenNumber: tokens.length + 1,
        ...req.body,
        status: "pending",
        time: new Date().toLocaleString()
    };
    tokens.push(newToken);
    writeJSON(TOKEN_FILE, tokens);
    res.json(newToken);
});

// Update token
app.put("/api/token/:id", (req, res) => {
    const tokens = readJSON(TOKEN_FILE);
    const id = parseInt(req.params.id);

    const index = tokens.findIndex(t => t.tokenNumber === id);
    if (index === -1) return res.status(404).json({ error: "Token not found" });

    tokens[index] = { ...tokens[index], ...req.body };
    writeJSON(TOKEN_FILE, tokens);

    res.json(tokens[index]);
});

// ---------------------------
// FEEDBACK ROUTES
// ---------------------------
app.get("/api/feedback", (req, res) => {
    const feedback = readJSON(FEEDBACK_FILE);
    res.json(feedback);
});

app.post("/api/feedback", (req, res) => {
    const feedback = readJSON(FEEDBACK_FILE);

    const newFeedback = {
        id: feedback.length + 1,
        ...req.body,
        time: new Date().toLocaleString()
    };

    feedback.push(newFeedback);
    writeJSON(FEEDBACK_FILE, feedback);

    res.json(newFeedback);
});

// ---------------------------
// SERVE FRONTEND FILES
// ---------------------------
app.use(express.static(__dirname)); // serve index.html and admin.html

// Render requires dynamic port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running at port ${PORT}`));



