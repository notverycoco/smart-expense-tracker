const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const savingsGoalController = require("../controllers/savingsGoalController");

router.post(
    "/add",
    verifyToken,
    savingsGoalController.createSavingsGoal
);

router.get(
    "/all",
    verifyToken,
    savingsGoalController.getSavingsGoals
);

router.put(
    "/:id/add-money",
    verifyToken,
    savingsGoalController.addMoneyToGoal
);

router.put(
    "/:id",
    verifyToken,
    savingsGoalController.updateSavingsGoal
);

router.delete(
    "/:id",
    verifyToken,
    savingsGoalController.deleteSavingsGoal
);

module.exports = router;