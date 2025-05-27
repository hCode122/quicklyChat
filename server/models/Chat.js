const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    sendName: {type: String, required: true},
    recName: {type: String, required: true},
})

module.exports = mongoose.model("chat", ChatSchema);