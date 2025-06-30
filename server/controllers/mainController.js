const { default: mongoose } = require("mongoose");
const User = require("../models/User")
const Chat = require("../models/Chat")
const Message = require("../models/Message")
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../utils/cloudinary');



exports.getContacts = async (req, res) => {
  const _id = req.user._id;

  try {
    const user_contacts = await User.findOne({ _id }).select('Contacts name');
    const contactData = [];

    if (!user_contacts || user_contacts.Contacts.length === 0) {
      return res.status(200).json(contactData);
    }

    const contacts = await User.find({ _id: { $in: user_contacts.Contacts } })
      .select('name bio profilePic');

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];

      const chat = await Chat.findOne({
        $or: [
          { sendName: user_contacts.name, recName: contact.name },
          { sendName: contact.name, recName: user_contacts.name }
        ]
      });

      let lastMessage = null;

      if (chat) {
        const latestMsg = await Message.findOne({ chatId: chat._id }).sort({ date: -1 });

unreadCount = await Message.countDocuments({
      chatId: chat._id,
      senderName: contact.name,
      read: false
    });
        if (latestMsg) {
          lastMessage = {
            text: latestMsg.text || (latestMsg.attachment?.originalName ?? 'Attachment'),
            time: latestMsg.date,
             unreadCount
          };
        }

      

      }

      contactData.push({
        _id: contact._id,
        name: contact.name,
        bio: contact.bio,
        profilePic: contact.profilePic,
        lastMessage,
      });
    }

     contactData.sort((a, b) => {
      const timeA = a.lastMessage?.time ? new Date(a.lastMessage.time) : new Date(0);
      const timeB = b.lastMessage?.time ? new Date(b.lastMessage.time) : new Date(0);
      return timeB - timeA;
    });

    return res.status(200).json(contactData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to get contacts" });
  }
};


exports.search = async (req, res) => {
    const user = req.user._id;
    const {search} = req.body;

    try {
        const Mycontacts = await User.findOne({_id: user}).populate("Contacts")
        const newCAr = Object.values(Mycontacts.Contacts)
        const nameArr = newCAr.map(contact => {return contact.name})
        nameArr.push(Mycontacts.name)
const data = await User.find({
  $and: [
    { name: { $regex: '^' + search, $options: 'i' } },
    { name: { $nin: nameArr } }
  ]
}).select('name bio profilePic');

        let returnedData = []
        
        const newDAr = Object.values(data)
        
        for (let i = 0; i < newDAr.length; i+=1) {
            if (!newCAr.includes(newDAr[i]))
            {returnedData.push(newDAr[i])}
                
        }
if (returnedData.length > 0) return res.status(200).json(returnedData);
        else return res.status(404)
    } catch (e) {
        console.log(e)
    }
} 


exports.addContact = async (req, res) => {
  const userId = req.user._id;
  const { toAdd } = req.body;

  try {
    const userToAdd = await User.findOne({ name: toAdd });
    if (!userToAdd) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const currentUser = await User.findById(userId);
    const alreadyExists = currentUser.Contacts.includes(userToAdd._id);

    if (!alreadyExists) {
      await User.updateOne(
        { _id: userId },
        { $addToSet: { Contacts: userToAdd._id } }
      );
    }

    await User.updateOne(
      { _id: userToAdd._id },
      { $addToSet: { Contacts: userId } }
    );

    let chat = await Chat.findOne({
      $or: [
        { sendName: currentUser.name, recName: userToAdd.name },
        { sendName: userToAdd.name, recName: currentUser.name }
      ]
    });

    if (!chat) {
      chat = await Chat.create({
        sendName: currentUser.name,
        recName: userToAdd.name,
      });

      await User.updateOne(
        { _id: userId },
        { $addToSet: { Chats: chat._id } }
      );
      await User.updateOne(
        { _id: userToAdd._id },
        { $addToSet: { Chats: chat._id } }
      );
    }

    return res.status(200).json({ message: "User added and chat created successfully", chat});
  } catch (error) {
    console.error(' Add Contact Error:', error);
    return res.status(500).json({ error: "Failed to add contact" });
  }
};


exports.getChats = async (req, res) => {
    const _id = req.user._id;

    try {
        const chats = await User.findOne({_id}).select("Chats name");

        const chatData = {}

        for (let i = 0; i < chats["Chats"].length; i+=1) {
            const _id =  chats["Chats"][i]["_id"]
            const chat = await Chat.findOne({_id})
            const lastM = await Message.findOne({chatId:chat._id}).sort({date: -1})
            const count = (await Message.find({chatId:chat._id, senderName:{$ne: chats.name} ,
                read:false})).length

            const recname = chats["name"] == chat.sendName ? chat.recName : chat.sendName;
            chatData[recname] = {lastM: lastM,
              unreadCount: count,
              readAt: lastM?.readAt || null,
              key: v4.v4()}
        }
        return res.status(200).json(chatData);
    } catch (error) {
        console.log(error)
    }
}



exports.createMessage = async (req, res) => {
    const newMsg = req.body;
    const user = req.user._id;
    const dbMsg = {
        text : newMsg.text,
        senderName: newMsg.senderName,
        chatId:newMsg.chatId,
        date: newMsg.date,
        read: newMsg.read,
        attachment: newMsg.attachment || null,
        forwarded: newMsg.forwarded || false 

    }

    try {
        const createdMsg = await Message.create(dbMsg).then(
            result => {return result})
        await Chat.updateOne(
            {_id:newMsg.chatId},
            {
                $push: {
                    Messages:createdMsg._id
                }
            }  
        )
console.log("Created message:", createdMsg);

        return res.status(200).json(createdMsg)
        
    } catch (e) {
        console.log(e)
    }
}
    
exports.chatCheck = async (req, res) => {
    const {sender, receiver} = req.body;
    try {
        await Chat.findOne({
            $or:[
                { $and: [
                        {sendName:sender},
                        {recName:receiver}
                    ]
                },
                {
                    $and: [
                        {sendName:receiver},
                        {recName:sender}
                    ]
                }
            ]
        }).then(result => {return res.json(result)})
    } catch (e) {
        console.log(e)
    }
}

exports.loadMessages = async (req, res) => {
  const { depth, chat } = req.body;

  try {
    const messages = await Message.find({ chatId: chat })
      .sort({ date: -1 })
      .skip(depth * 20)
      .limit(20);

    const reversed = messages.reverse(); 

    return res.status(200).json({ messages: reversed, moreExists: messages.length === 20 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to load messages" });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};


exports.getUserStatus = async (req, res) => {
  try {
    const user = await User.findOne(
      {name: new RegExp(`^${req.params.username}$`, 'i')},
      {lastOnline: 1, socketId: 1}
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    const isOnline = user.socketId !== null;
   
    res.status(200).json({
      isOnline,
      lastOnline: user.lastOnline,
      socketId: user.socketId
    });
  } catch (error) {
    res.status(500).json({error: "Status check failed"});
  }
};



exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }


    if (message.attachment && message.attachment.url) {
      const cloudinaryPublicId = extractPublicId(message.attachment.url);

      if (cloudinaryPublicId) {
        const isImage = message.attachment.mimeType?.startsWith('image/');
        const resourceType = isImage ? 'image' : 'raw';

        await cloudinary.uploader.destroy(cloudinaryPublicId, { resource_type: resourceType });
      }
    }

    await Message.deleteOne({ _id: message._id });

    req.app.locals.io.to(message.chatId).emit('message_deleted', message._id);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
      deletedId: message._id
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Failed to delete message',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

function extractPublicId(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return match ? match[1] : null;
}



exports.searchMessages = async (req, res) => {
  try {
    const { chatId, q } = req.body;

    if (!chatId || !q) {
      return res.status(400).json({ error: 'chatId and search query are required' });
    }

    const keyword = q.trim();
    const regex = new RegExp(`(${keyword})`, 'gi');

    const messages = await Message.find({
      chatId,
      text: { $regex: regex }
    }).sort({ date: -1 });

    const results = messages.map(msg => {
      const highlightedText = msg.text.replace(regex, '<mark>$1</mark>');

      return {
        _id: msg._id,
        chatId: msg.chatId,
        senderName: msg.senderName,
        date: msg.date,
        read: msg.read,
        text: highlightedText,
        attachment: msg.attachment || null
      };
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
};



exports.getPublicProfile = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ name: username }).select('name profilePic bio');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      profilePic: user.profilePic || {},
      bio: user.bio || ''
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

exports.clearMessagesByChatId = async (req, res) => {
  const { chatId } = req.params;

  try {
    const result = await Message.deleteMany({ chatId });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error("Error clearing messages:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


exports.removeContact = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const senderName = chat.sendName;
    const receiverName = chat.recName;

    const sender = await User.findOne({ name: senderName });
    const receiver = await User.findOne({ name: receiverName });

    await Chat.findByIdAndDelete(chatId);
    await Message.deleteMany({ chatId });

    if (sender) {
      sender.Chats.pull(chatId);
      sender.Contacts.pull(receiver._id);
      await sender.save();
    }

    if (receiver) {
      receiver.Chats.pull(chatId);
      receiver.Contacts.pull(sender._id);
      await receiver.save();
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Remove chat error:", err);
    return res.status(500).json({ error: "Failed to remove contact" });
  }
};

exports.createChat = async (req, res) => {
    const {sendName, recName} = req.body;
    
    const newChat = {
        sendName: sendName,
        recName: recName,
        Messages: []
    }

    try {
        const reslt = await Chat.create(newChat).then(result => {return result});
        await User.updateOne(
            {name:sendName},
            {
                $push: {
                    Chats: reslt._id
                }
            }
        );
        await User.updateOne(
            {name:recName},
            {
                $push: {
                    Chats: reslt._id
                }
            }
        );
            
        return res.status(200).json(reslt);
    } catch (e) {
        return console.log(e)
    }



}