const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const router = express.Router();

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'book-slot',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    }
    console.log('Connected to the MySQL database.');
});

// Serve HTML form for booking slots
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'book.html')); // Ensure your HTML file is in the 'public' folder
});


router.get('/slot', (req, res) => {
    res.send('slot Page');
});
// API endpoint to handle form submission
router.post('/submit', (req, res) => {
    const { name, age, date, time, concern } = req.body;

    if (!name || !age || !date || !time || !concern) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Insert data into the patient table
    const query = 'INSERT INTO patient (name, age, date, time, concern) VALUES (?, ?, ?, ?, ?)';
    const values = [name, age, date, time, concern];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err.message);
            return res.status(500).json({ message: 'Failed to book the slot. Please try again.' });
        }

        console.log('Data inserted successfully:', result);
        res.status(200).json({ message: 'Slot booked successfully!', redirect: true });
    });
});

module.exports = router;
