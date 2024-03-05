const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    Chats: [{ type : mongoose.Schema.Types.ObjectId, ref: 'chat' }],
    Contacts: [{ type : mongoose.Schema.Types.ObjectId, ref: 'user' }]
})

module.exports = mongoose.model("user", UserSchema);
