const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    text: {type: String, required: true},
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'user' , required: true},
    chatId: {type: mongoose.Schema.Types.ObjectId, ref: 'chat', required: true},
    date: {type: Date, required: true}
})

export const MessageModel = mongoose.model("message", MessageSchema);