const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const expenseController = require("../controllers/expenseController");

router.post("/add", verifyToken, expenseController.addExpense);

router.get("/all", verifyToken, expenseController.getExpenses);

router.put("/:id", verifyToken, expenseController.updateExpense);

router.delete("/:id", verifyToken, expenseController.deleteExpense);

module.exports = router;