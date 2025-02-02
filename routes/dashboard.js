const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Temporary in-memory storage for user data (replace with database in production)
const users = {}; // Example: { username: { username: "user1", avatar: "/uploads/avatar.jpg" } }

// Storage for uploaded profile images
const storage = multer.diskStorage({
  destination: "./public/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (!req.session || !req.session.username) {
    return res.redirect("/login"); // Redirect to login if not authenticated
  }
  next();
}

// Serve Dashboard (dash.html)
router.get("/dash", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dash.html"));
});

// API to Get User Details for Dashboard
router.get("/user-details", isAuthenticated, (req, res) => {
  const user = users[req.session.username];
  if (user) {
    res.json({ username: user.username, avatarUrl: user.avatar });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// API to Update Profile (Username & Avatar)
router.post("/update-profile", isAuthenticated, upload.single("avatar"), (req, res) => {
  const user = users[req.session.username];
  if (user) {
    const { username } = req.body;
    if (username) {
      user.username = username;
    }

    if (req.file) {
      user.avatar = `/public/${req.file.filename}`;
    }

    res.json({ success: true, message: "Profile updated successfully", user });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Redirect to o.html for specific routes
router.get("/o.html", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public','o.html'));
});

// Route to handle logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during session destruction:", err);
      return res.status(500).send("Logout failed");
    }
    res.redirect("/login");
  });
});

module.exports = router;
