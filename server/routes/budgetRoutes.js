const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const budgetController = require("../controllers/budgetController");

router.post("/add", verifyToken, budgetController.addBudget);
router.get("/all", verifyToken, budgetController.getBudgets);
router.put("/:id", verifyToken, budgetController.updateBudget);
router.delete("/:id", verifyToken, budgetController.deleteBudget);
router.get("/summary", verifyToken, budgetController.getBudgetSummary);

module.exports = router;