const mongoose = require("mongoose");

const BookieData = new mongoose.Schema({
    AmountSpent:{
        type: Number,
        default: 0
    },
    AmountEarned: {
        type: Number,
        default: 0
    }, 
    CurrentAmount: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("BookieData", BookieData);
