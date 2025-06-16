const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    role: {
        type: String,
        enum: ["admin", "member",'team_lead','manager'],
        default: "member"
    },
    assigned_task:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task"
    }],
    assigned_teams:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team"
    }]
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.createToken = function () {
    return jwt.sign({ id: this._id, role: this.role, name: this.name, email: this.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
}

const User = mongoose.model("User", userSchema);
module.exports = User;