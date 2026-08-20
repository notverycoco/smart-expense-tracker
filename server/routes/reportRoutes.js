const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const reportController = require("../controllers/reportController");


router.get(
    "/monthly",
    verifyToken,
    reportController.getMonthlyReport
);

router.get(
    "/category",
    verifyToken,
    reportController.getCategoryReport
);

router.get(
    "/transactions",
    verifyToken,
    reportController.getTransactionReport
);


module.exports = router;