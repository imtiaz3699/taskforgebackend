const Task = require("../models/task.model");

async function createTask(req, res) {
    const { title, description, created_by,assigned_to } = req.body;
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
            created_by,
            assigned_to,
        })
        return res.status(201).json(task)
    } catch (e) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function getTask(req, res) {
    const { page = 1, limit = 20 } = req.query;
    try {
        const response = await Task.find().populate("created_by").populate("assigned_to").skip((page - 1) * limit).limit(limit);
        const totalRecords = await Task.countDocuments();
        const data = {
            totalRecords,
            total:response?.length,
            task:response,
            page,
            limit,
            totalPages:Math.ceil(totalRecords / limit)
        }
        return res.status(200).json(data)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}
// 03302348150
async function assignTask(req, res) {

}

module.exports = {
    createTask,
    getTask
}