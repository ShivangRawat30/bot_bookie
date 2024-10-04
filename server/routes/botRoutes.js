const express = require('express');
const router = express.Router();

const {
    createBot,
    getAllBots,
    getBotById,
    enterLotteries,
    updateBot,
    sendEthBack,
} = require('../controllers/botController');

// Create a new bot
router.post('/create/:num', createBot);

// Get all bots
router.get('/get/bots', getAllBots);

// Get a single bot by ID
router.get('/:id', getBotById);

router.post('/enter/:max', enterLotteries);

router.put('/update/:pubKey/:isWorking', updateBot);

router.get('/get/eth', sendEthBack);

module.exports = router;