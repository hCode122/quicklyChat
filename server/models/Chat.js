const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    sendName: {type: String, required: true},
    recName: {type: String, required: true},
    Messages: [{ type : mongoose.Schema.Types.ObjectId, ref: 'chat' }]
})

module.exports = mongoose.model("chat", ChatSchema);