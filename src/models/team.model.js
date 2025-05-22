const mongoose = require("mongoose");

const teamsSchema = new mongoose.Schema({
    team_title:{
         type:String,
         required:true,   
    },
    team_members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
})
const Team = mongoose.model("Team",teamsSchema);
module.exports = Team