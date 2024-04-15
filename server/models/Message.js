const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    text: {type: String, required: true},
    senderName: {type: String , required: true},
    chatId: {type: mongoose.Schema.Types.ObjectId, ref: 'chat', required: true},
    date: {type: Date, required: true},
    read: {type:Boolean, required: true}
})

module.exports = mongoose.model("message", MessageSchema);