const { default: mongoose } = require("mongoose");
const User = require("../models/User")
const Chat = require("../models/Chat")

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
        const data = await User.find({name: {$regex: '^'+search, $options: 'i'}})

        if (data) return res.status(200).json(data)
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
            const old = await User.findOne({"name.Contacts.name": toAdd})
            if (old) {throw(Error("Contacts already added")) }
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
        const chats = await User.findOne({_id}).select("Chats");

        const chatData = []
        for (let i = 0; i < chats["Chats"].length; i+=1) {
            const _id =  chats["Chats"][i]
            const user = await User.findOne({_id})
            chatData.push(user)
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
        await Chat.create(newChat).then(
            () => {res.status(200)});
    } catch (e) {
        return console.log(e)
    }



}