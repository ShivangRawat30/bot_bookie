const express = require('express');
const router = express.Router();

const {
    createBot,
    getAllBots,
    getBotById,
    enterLotteries,
} = require('../controllers/botController');

// Create a new bot
router.post('/create', createBot);

// Get all bots
router.get('/get/bots', getAllBots);

// Get a single bot by ID
router.get('/:id', getBotById);

router.post('/enter/:publicKey/:max', enterLotteries);

module.exports = router;