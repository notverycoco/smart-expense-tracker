const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const recurringExpenseController = require("../controllers/recurringExpenseController");


router.post(
    "/add",
    verifyToken,
    recurringExpenseController.addRecurringExpense
);


router.get(
    "/all",
    verifyToken,
    recurringExpenseController.getRecurringExpenses
);

router.get(
    "/upcoming",
    verifyToken,
    recurringExpenseController.getUpcomingRecurringExpenses
);


router.put(
    "/:id",
    verifyToken,
    recurringExpenseController.updateRecurringExpense
);


router.delete(
    "/:id",
    verifyToken,
    recurringExpenseController.deleteRecurringExpense
);


module.exports = router;