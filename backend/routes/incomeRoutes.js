const express = require("express");
const { addIncome, getIncome } = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addIncome);
router.get("/", protect, getIncome);

module.exports = router;
