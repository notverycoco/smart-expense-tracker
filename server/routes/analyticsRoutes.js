const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const analyticsController = require("../controllers/analyticsController");

router.get(
    "/expense-by-category",
    verifyToken,
    analyticsController.getExpenseByCategory
);

router.get(
    "/monthly",
    verifyToken,
    analyticsController.getMonthlyIncomeExpense
);

router.get(
    "/recent",
    verifyToken,
    analyticsController.getRecentTransactions
);

module.exports = router;