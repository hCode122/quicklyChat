const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/User")


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn:'3d'})
}

exports.login = async (req, res) => {
    const {username, password} = req.body;
    console.log(username)
    try {
        const user = await User.findOne({name:username});

        if (!user) {
            throw Error("User doesn't exist")
        }

        const match = bcrypt.compare(password,user.password)

        if (!match) {
            throw Error("Password is incorrect")
        }

        const token = createToken(user._id);

        return res.status(200).json({username, token});
    } catch (error) {
        return res.status(400).json({error:error.message});
    }
}

exports.signup = async (req,res) => {
    const {username, password} = req.body;
    try {
        const exists = await User.findOne({name:username})

        if (exists) {
            throw Error("User already exists!");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await User.create({name:username,password:hash});

        const token = createToken(user._id)
      
        return res.status(200).json({username, token})

    } catch (error) {
        return res.status(400).json({error:error.message});
    }
}