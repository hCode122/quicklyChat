const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    chatId: {type: mongoose.Schema.Types.ObjectId, ref: 'chat', required: true},
    recId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    Messages: [{ type : mongoose.Schema.Types.ObjectId, ref: 'chat' }]
})

export const ChatModel = mongoose.model("chat", ChatSchema);