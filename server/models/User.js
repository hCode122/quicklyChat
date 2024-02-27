const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    Chats: [{type: String }],
    Contacts: [{ type: String }]
})

module.exports = mongoose.model("user", UserSchema);
