const express = require('express');
const mysql = require('mysql');
const path = require('path');

const router = express.Router();

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'customer_details',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Route to serve the contact form HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact1.html'));
});

router.get('/form', (req, res) => {
    res.send('Form Page');
});

// API Endpoint to handle form submission
router.post('/submit-form', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO details (name, email, subject, message) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, subject, message], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Form submitted successfully!' });
    });
});

module.exports = router;
