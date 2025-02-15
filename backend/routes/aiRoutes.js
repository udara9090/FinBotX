const express = require("express");
const { getAIExpenseAnalysis } = require("../controllers/aiController");
const router = express.Router();

router.post("/analyze", getAIExpenseAnalysis);

module.exports = router;
