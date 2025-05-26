const User = require("../models/user.model")
const jwt = require("jsonwebtoken");
async function register(req, res) {
    try {
        const { name, email, password,role } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            })
        }
        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            })
        }
        const userExists = await User.find({ email });
        if (userExists.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const user = await User.create({
            name,
            email,
            password,
            role
        })
        const userObj = user.toObject();
        delete userObj.password
        return res.status(201).json({user:userObj})
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal server error",
            error: e.message
        })
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            })
        }
        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            })
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }       
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }
        const token = jwt.sign({ id: user._id, role: user.role, email: user.email, name: user.name }, process.env.JWT_SECRET, {
            expiresIn: `7d`,
        });
        const userObj = user.toObject();
        delete userObj.password
        return res.status(200).json({
            userObj,
            token
        })
    } catch (e) {
        return res.status(500).json({
            message: "Internal server error",
            error: e.message
        })
    }
}

async function getUsers(req,res) {
    try {
        const users = await User.find();
        return res.status(200).json(users)
    }catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Internal server error",
            error: e.message
        })
    }
}
module.exports = {
    register,
    login,
    getUsers
}