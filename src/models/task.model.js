const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
        },
        created_by:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        assigned_to:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        status:{
            type:String,
            enum:["pending","inprogress","completed"],
            default:"pending"
        },
        priority:{
            type:String,
            enum:["low","medium","high"],
            default:"low"
        },
        due_date:{
            type:Date,
        },
        // comments:[{
        //     type:mongoose.Schema.Types.ObjectId,
        //     ref:"Comment"
        // }]

},{timestamps:true})

module.exports = mongoose.model("Task",taskSchema)