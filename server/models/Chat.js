const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    senderId: {type: Number, required: true},
    chatId: {type: Number, required: true},
    recId: {type: Number, required: true},
    Messages: {type: Array}
})

export const ChatModel = mongoose.model("chat", ChatSchema);