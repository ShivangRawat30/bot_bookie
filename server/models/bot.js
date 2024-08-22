const mongoose = require("mongoose");

const botSchema = new mongoose.Schema({
    publicKey:{
        type: String,
        require: true,
        unique:true,
    },
    privateKey: {
        type: String,
        require: true,
    },
    iv: {
        type: String,
        require: true,
    },
   currentlyWorking: {
    type: Boolean,
    default: false
   }

})

module.exports = mongoose.model("Bot", botSchema);
