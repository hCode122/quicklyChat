const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    bio: { type: String, default: '' },
  profilePic: {
    url: String,
    thumbnail: String,
  },
    Chats: [{ type : mongoose.Schema.Types.ObjectId, ref: 'chat' }],
    Contacts: [{ type : mongoose.Schema.Types.ObjectId, ref: 'user' }],
    lastOnline: {type: Date, default: null },
    socketId: { type: String, default: null },
})

module.exports = mongoose.model("user", UserSchema);
