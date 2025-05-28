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
async function updateTask(req, res) {
    const { title, description, created_by, assigned_to, due_date, status } = req.body;
    const { id } = req.params;
    console.log(id,'fadslfkadjhakjd')
    if (!id) {
        return res.status(400).json({ message: "Task ID is required" });
    }

    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    if (!created_by) {
        return res.status(400).json({ message: "Created by is required" });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                title,
                description,
                created_by,
                assigned_to,
                due_date,
                status
            },
            { new: true } // returns the updated document
        );
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json(updatedTask);
    } catch (e) {
        console.error("Error updating task:", e);
        return res.status(500).json({ message: "Internal server error" });
    }
}


async function getTask(req, res) {
    const { page = 1, limit = 20 } = req.query;
    try {
        const response = await Task.find().populate("created_by").populate("assigned_to").skip((page - 1) * limit).limit(limit);
        const totalRecords = await Task.countDocuments();
        const data = {
            totalRecords:totalRecords,
            total:response?.length,
            task:response,
            page:Number(page),
            limit:Number(limit),
            totalPages:Math.ceil(totalRecords / limit)
        }
        return res.status(200).json(data)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}
async function getSingleTask(req, res) {
    try {
        const response = await Task.findById(req.params.id).populate("created_by").populate("assigned_to");
        console.log(response)
        const data = {
            task:response
        }
        return res.status(200).json(data)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}
async function deleteTask (req,res)  {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task) {
            return res.status(404).json({
                message: "Task not found"
            })
        }
        return res.status(200).json({
            message: "Task deleted successfully"
        })
    }catch (e) {
        console.log(e)
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
    getTask,
    getSingleTask,
    updateTask,
    deleteTask
}