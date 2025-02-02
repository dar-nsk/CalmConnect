const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(
    session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: true,
    })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/auth", authRoutes);

app.get("/dashboard/dash", (req, res) => {
    if (!req.session.username) {
        return res.redirect("/");
    }

    res.sendFile(path.join(__dirname, "public", "dash.html"));
});

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "flicity.html"));
});

// 404 handler
app.use((req, res) => {
    res.status(404).send("Page not found");
});

module.exports = app;
