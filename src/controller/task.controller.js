const Task = require("../models/task.model");

async function createTask(req, res) {
  const { title, description, created_by, assigned_to } = req.body;
  if (!title) {
    return res.status(400).json({
      message: "Title is required",
    });
  }
  if (!created_by) {
    return res.status(400).json({
      message: "Created by is required",
    });
  }
  try {
    const task = await Task.create({
      title,
      description,
      created_by,
      assigned_to,
    });
    return res.status(201).json(task);
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
async function updateTask(req, res) {
  const { title, description, created_by, assigned_to, due_date, status } =
    req.body;
  const { id } = req.params;
  console.log(id, "fadslfkadjhakjd");
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
        status,
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

// async function getTask(req, res) {
//   const {
//     page = 1,
//     limit = 20,
//     title,
//     assigned_to,
//     status,
//     priority,
//     user_name
//   } = req.query;
//   let filters = {
//     created_by: req.user.id,
//   };
//   if (title) {
//     filters.title = { $regex: title, $options: "i" }; // Case-insensitive search
//   }
//   if (status) {
//     filters.status = status;
//   }
//   if (assigned_to) {
//     filters.assigned_to = assigned_to;
//   }
//   try {
//     const pipeline = [
//       {
//         $lookup: {
//           from: "users",
//           localField: "assigned_to",
//           foreignField: "_id",
//           as: "assigned_user",
//         },
//       },
//       {
//         $unwind: "$assigned_user",
//       },
//       {
//         $match: {
//           "assigned_user.name": { $regex: user_name, $options: "i" },
//         },
//       },
//       {
//         $skip: skip,
//       },
//       {
//         $limit: Number(limit),
//       },
//       {
//         $project: {
//           title: 1,
//           description: 1,
//           status: 1,
//           priority: 1,
//           assigned_to: "$assigned_user",
//           createdAt: 1,
//           updatedAt: 1,
//         },
//       },
//     ];
//     const tasks = await Task.aggregate(pipeline);
    
//     const response = await Task.find(filters)
//       .populate("created_by")
//       .populate("assigned_to")
//       .skip((page - 1) * limit)
//       .limit(limit);
//     const totalRecords = await Task.countDocuments({ created_by: req.user.id });
//     const data = {
//       totalRecords: totalRecords,
//       total: response?.length,
//       task: response,
//       page: Number(page),
//       limit: Number(limit),
//       totalPages: Math.ceil(totalRecords / limit),
//     };
//     return res.status(200).json(tasks);
//   } catch (e) {
//     return res.status(500).json({
//       message: e,
//     });
//   }
// }

const mongoose = require("mongoose");

async function getTask(req, res) {
  const {
    page = 1,
    limit = 20,
    title,
    assigned_to,
    status,
    priority,
    user_name
  } = req.query;

  const skip = (page - 1) * limit;

  try {
    const matchStage = {
      created_by: new mongoose.Types.ObjectId(req.user.id),
    };

    if (title) {
      matchStage.title = { $regex: title, $options: "i" };
    }

    if (status) {
      matchStage.status = status;
    }

    if (priority) {
      matchStage.priority = priority;
    }

    if (assigned_to) {
      matchStage.assigned_to = new mongoose.Types.ObjectId(assigned_to);
    }

    const pipeline = [
      { $match: matchStage },

      {
        $lookup: {
          from: "users",
          localField: "assigned_to",
          foreignField: "_id",
          as: "assigned_user",
        },
      },
      { $unwind: "$assigned_user" },
      ...(user_name
        ? [
            {
              $match: {
                "assigned_user.name": { $regex: user_name, $options: "i" },
              },
            },
          ]
        : []),

      // Pagination
      { $skip: skip },
      { $limit: Number(limit) },

      // Final projection
      {
        $project: {
          title: 1,
          description: 1,
          status: 1,
          priority: 1,
          createdAt: 1,
          updatedAt: 1,
          assigned_to: "$assigned_user",
        },
      },
    ];

    const tasks = await Task.aggregate(pipeline);

    // Count total matching documents (without pagination stages)
    const countPipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "assigned_to",
          foreignField: "_id",
          as: "assigned_user",
        },
      },
      { $unwind: "$assigned_user" },
      ...(user_name
        ? [
            {
              $match: {
                "assigned_user.name": { $regex: user_name, $options: "i" },
              },
            },
          ]
        : []),
      { $count: "total" },
    ];

    const countResult = await Task.aggregate(countPipeline);
    const totalRecords = countResult[0]?.total || 0;

    return res.status(200).json({
      task: tasks,
      totalRecords,
      total: tasks.length,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalRecords / limit),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getSingleTask(req, res) {
  try {
    const response = await Task.findById(req.params.id)
      .populate("created_by")
      .populate("assigned_to");
    console.log(response);
    const data = {
      task: response,
    };
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({
    message: e,
    });
  }
}
async function deleteTask(req, res) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: e,
    });
  }
}
// 03302348150
async function assignTask(req, res) {}

module.exports = {
  createTask,
  getTask,
  getSingleTask,
  updateTask,
  deleteTask,
};
