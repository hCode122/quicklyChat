const { default: mongoose } = require("mongoose");
const User = require("../models/User")
const Chat = require("../models/Chat")
const Message = require("../models/Message")
const v4 = require("uuid")

exports.getContacts = async (req, res) => {
    const _id = req.user;
    try {
        const user_contacts = await User.findOne({_id}).select('Contacts')
        const contactData = []
        for (let i = 0; i < user_contacts["Contacts"].length; i+=1) {
            const _id =  user_contacts["Contacts"][i]
            const user = await User.findOne({_id}).select("name")
            contactData.push(user)
        }
        
        return res.status(200).json(contactData)
    } catch(err) {
        console.log(err)
    }
    
}

exports.search = async (req, res) => {
    const user = req.user
    const {search} = req.body

    try {
        const Mycontacts = await User.findOne({_id: user}).populate("Contacts")
        const newCAr = Object.values(Mycontacts.Contacts)
        const nameArr = newCAr.map(contact => {return contact.name})
        nameArr.push(Mycontacts.name)
        const data = await User.find({name: {$regex: '^'+search, $options: 'i', $nin: nameArr}  })
        let returnedData = []
        
        const newDAr = Object.values(data)
        
        for (let i = 0; i < newDAr.length; i+=1) {
            if (!newCAr.includes(newDAr[i]))
            {returnedData.push(newDAr[i])}
                
        }
        if (returnedData) return res.status(200).json(data)
        else return res.status(404)
    } catch (e) {
        console.log(e)
    }
} 

exports.addContact = async (req, res) => {
    const user = req.user
    const {toAdd} = req.body
   
    try {
        const exists = await User.findOne({name:toAdd})
        if (exists) {
            const old = await User.findOne({_id:user}, {contacts: {$elemMatch: { _id: exists._id }} })
            const id = exists._id
            await User.updateOne(
                {_id: user},
                {
                    $push: {
                        Contacts: id
                    }
                })
            
        } else  throw(Error("Contacts doesn't exist"))
        return res.status(200).json({message: "User added successfully"})
    } catch (error) {
        console.log(error)
    }
}

exports.getChats = async (req, res) => {
    const _id = req.user;

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
            chatData[recname] = {lastM: lastM, unreadCount: count, key: v4.v4()}
        }
        return res.status(200).json(chatData);
    } catch (error) {
        console.log(error)
    }
}

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

exports.createMessage = async (req, res) => {
    const newMsg = req.body;
    const user = req.user;
    const dbMsg = {
        text : newMsg.text,
        senderName: newMsg.senderName,
        chatId:newMsg.chatId,
        date: newMsg.date,
        read: newMsg.read
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
    const {depth,chat, date} = req.body;

    try {
        let unreadNum = 0;
        let moreExists = 0
        console.log(date)
        console.log(new Date())
        const unreadMessages = await Message.find({
            date: {
                $gte: date,
                $lte: new Date()
            }
        })
        console.log(unreadMessages)
        if (unreadMessages.length < 2) {
            const messages = (await Message.find({chatId:chat}).skip(depth*20).limit(21).sort("-date")).reverse();
            const msgsLen = messages.length;
            console.log('aaa')
            if (msgsLen == 21) {
                moreExists = 1
                return res.status(200).json({messages:messages.slice(1,21),moreExists});
            } else {
                moreExists = 0
                return res.status(200).json({messages:messages.slice(0,21),moreExists});
            }
        } else {
            unread = unreadMessages.length;
            console.log(unreadMessages)

        }
        
        
         
        
    } catch (error) {
        console.log(error)
    }
}