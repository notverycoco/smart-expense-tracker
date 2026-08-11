const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/authMiddleware");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Test Route
app.post("/test", (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/budget", budgetRoutes);


app.get("/profile", verifyToken, (req, res) => {

    res.json({
        message: "Welcome",
        user: req.user
    });

});

app.get("/", (req, res) => {
    res.send("Welcome to Smart Expense Tracker API 🚀");
});

module.exports = app;