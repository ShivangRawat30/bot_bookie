const express = require('express');
const router = express.Router();

const {addAmountSpend, createData, addAmountEarned,getAllData} = require("../controllers/bookieDataController");

router.post('/new/bookie', createData)
router.put('/add/amountspent', addAmountSpend);
router.put('/add/amountearned', addAmountEarned);
router.get('/get/all/data', getAllData);

module.exports = router;