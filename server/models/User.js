const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    Chats: [{type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    Contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
})

module.exports = mongoose.model("User", UserSchema);