const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const incomeController = require("../controllers/incomeController");

router.post("/add", verifyToken, incomeController.addIncome);
router.get("/", verifyToken, incomeController.getAllIncome);

module.exports = router;