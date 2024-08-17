const express = require('express');
const router = express.Router();

const {
    createBot,
    getAllBots,
    getBotById,
} = require('../controllers/botController');

// Create a new bot
router.post('/create', createBot);

// Get all bots
router.get('/get/bots', getAllBots);

// Get a single bot by ID
router.get('/:id', getBotById);

module.exports = router;