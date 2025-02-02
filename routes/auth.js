const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise"); // Use the promise-based version
const path = require('path');

// Database connection (using promise-based API)
let db; // Declare a variable to store the connection

// Create the connection asynchronously
const connectDb = async () => {
  if (!db) {
    db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", // Replace with your MySQL password
      database: "sign-up", // Replace with your MySQL database name
    });
  }
  return db;
};

// Route to serve login page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Establish DB connection
    const connection = await connectDb();
    
    // Check if user already exists
    const [existingUser] = await connection.query("SELECT * FROM register WHERE email = ?", [email]);
    if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await connection.query("INSERT INTO register (username, email, password) VALUES (?, ?, ?)", [
        username,
        email,
        hashedPassword,
    ]);

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Establish DB connection
    const connection = await connectDb();

    // Query database for user
    const [users] = await connection.query("SELECT * FROM register WHERE email = ?", [email]);

    if (users.length > 0) {
        const user = users[0];

        // Compare password with hashed password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            // Set session
            req.session.username = user.username;

            // Redirect to dashboard page
            return res.redirect('/dashboard/dash');  // Use the appropriate route to serve dash.html
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
