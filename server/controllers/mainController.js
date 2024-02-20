const User = require("../models/User")
const Chat = require("../models/User")

exports.getContacts = async (req, res) => {
    const _id = req.user;

    try {
        const contacts = await User.findOne({_id}).select('Contacts')
        return res.status(200).json(contacts)
    } catch(err) {
        console.log(err)
    }
    
}


//To-Do
// Get postman or something like it to test your api end points, since making the front-end
// will drive you mad without all the data
// ya know paradoxes and stuff...