const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    senderId: {type: String, required: true},
    chatId: {type: String, required: true},
    recId: {type: String, required: true},
    Messages: {type: Array}
})

export const ChatModel = mongoose.model("chat", ChatSchema);