const Task = require("../models/task.model");

async function createTask(req, res) {
    const { title, description, created_by } = req.body;
    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        })
    }
    if (!created_by) {
        return res.status(400).json({
            message: "Created by is required"
        })
    }
    try {
        const task = await Task.create({
            title,
            description,
            created_by
        })
        return res.status(201).json(task)
    } catch (e) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function getTask(req, res) {
    const {page, limit} = req.query
    try {
        const task = await Task.find().populate("created_by").populate("assigned_to").skip((page - 1) * limit).limit(limit);
        return res.status(200).json(task)
    } catch (e) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function assignTask(req,res) {
          
}

module.exports = {
    createTask,
    getTask
}