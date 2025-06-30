const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/User")


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn:'3d'})
}

exports.login = async (req, res) => {
    let {username, password} = req.body;
    console.log(username)
    try {
        username = username.trim().toLowerCase();

        const user = await User.findOne({name: new RegExp(`^${username}$`, 'i')});

        if (!user) {
            throw Error("User doesn't exist")
        }

        const match = await bcrypt.compare(password,user.password)

        if (!match) {
            throw Error("Password is incorrect")
        }

        const token = createToken(user._id);

        return res.status(200).json({username:user.name, token});
    } catch (error) {
console.error(error);
return res.status(400).json({ message: error.message });
    }
}
exports.signup = async (req,res) => {
    let {username, password} = req.body;
    try {
            const normalizedUsername = username.trim().toLowerCase();

        const exists = await User.findOne({name: new RegExp(`^${username}$`, 'i')})

        if (exists) {
            throw Error("User already exists!");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await User.create({name:normalizedUsername,password:hash});

        const token = createToken(user._id)
      
        return res.status(200).json({name: user.name, token})

    } catch (error) {
        return res.status(400).json({error:error.message});
    }
}