const express = require("express");
const { getFinancialInsights, handleUserQuery } = require("../controllers/aiController");
const { handleGeneralFinanceQuery } = require("../controllers/aiController");  //Import new controller function

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/insights", protect, getFinancialInsights);
router.post("/query", protect, handleUserQuery); // Protect the query route
router.post("/general", protect, handleGeneralFinanceQuery); // New route for general finance queries

module.exports = router;