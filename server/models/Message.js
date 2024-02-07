const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    text: {type: String, required: true},
    senderId: {type: Number, required: true},
    chatId: {type: Number, required: true},
    date: {type: Date, required: true}
})

export const MessageModel = mongoose.model("message", MessageSchema);