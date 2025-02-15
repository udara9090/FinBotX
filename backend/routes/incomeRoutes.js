const express = require("express");
const { addIncome, getIncome } = require("../controllers/incomeController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add", authMiddleware, addIncome);
router.get("/", authMiddleware, getIncome);

module.exports = router;
