const Team = require("../models/team.model");
const Users = require("../models/user.model");
const Task = require("../models/task.model");
const { default: mongoose } = require("mongoose");

async function createTeam(req, res) {
  const { team_title, team_members, created_by, manager, team_lead } = req.body;
  if (!team_title) {
    return res.status(400).json({
      message: "Team title is required",
    });
  }
  if (!team_members?.length) {
    return res.status(400).json({
      message: "Team members are required",
    });
  }
  try {
    const team = await Team.create({
      team_title,
      team_members,
      created_by,
      manager,
      team_lead,
    });
    return res.status(201).json(team);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function updateTeam(req, res) {
  const { team_title, team_members, created_by, manager, team_lead } = req.body;
  const { teamId } = req.params;

  if (!teamId) {
    return res.status(400).json({
      message: "Team ID is required",
    });
  }

  if (!team_title) {
    return res.status(400).json({
      message: "Team title is required",
    });
  }

  if (!team_members?.length) {
    return res.status(400).json({
      message: "Team members are required",
    });
  }

  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      {
        team_title,
        team_members,
        created_by,
        manager,
        team_lead,
      },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    return res.status(200).json(updatedTeam);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getTeams(req, res) {
  try {
    const { page, limit } = req.query;
    const teams = await Team.find({ created_by: req.user.id })
      .populate("team_members")
      .populate("created_by")
      .populate("manager")
      .populate("team_lead")
      .skip((page - 1) * limit)
      .limit(limit);
    const totalRecords = await Team.countDocuments();
    const data = {
      data: teams,
      totalRecords: Number(totalRecords),
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalRecords / limit),
      total: teams?.length,
    };
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getSingleTeam(req, res) {
  const {
    page = 1,
    limit = 10,
    title,
    assigned_to,
    status,
    priority,
  } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  try {
    const teamWithTask = await Team.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
          // ...(title && {
          //   team_title: {
          //     $regex: title ?? "",
          //     $options: "i",
          //   },
          // }),
        },
      },
      {
        $lookup: {
          from: "tasks",
          let: { team_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$team_id", "$$team_id"] },
                ...(title && {
                  title: {
                    $regex: req?.query?.title?.trim(),
                    $options: "i",
                  },
                }),
                ...(status && {
                  status: {
                    $regex: status?.trim(),
                    $options: "i",
                  },
                }),
                ...(priority && {
                  priority: {
                    $regex: priority?.trim(),
                    $options: "i",
                  },
                }),
                ...(assigned_to && {
                  assigned_to: new mongoose.Types.ObjectId(assigned_to),
                }),
              },
            },
            { $sort: { createdAt: -1 } },
            { $skip: parseInt(skip) },
            { $limit: parseInt(limit) },
            {
              $lookup: {
                from: "users",
                localField: "created_by",
                foreignField: "_id",
                as: "created_by",
              },
            },
            {
              $unwind: {
                path: "$created_by",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "assigned_to",
                foreignField: "_id",
                as: "assigned_to",
              },
            },
            {
              $unwind: {
                path: "$assigned_to",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "assigned_by",
                foreignField: "_id",
                as: "assigned_by",
              },
            },
            {
              $unwind: {
                path: "$assigned_by",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "tasks",
        },
      },
      {
        $lookup: {
          from: "tasks",
          let: { team_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$team_id", "$$team_id"],
                },
              },
            },
            {
              $count: "total",
            },
          ],
          as: "taskCount",
        },
      },
      {
        $addFields: {
          totalTasks: {
            $ifNull: [{ $arrayElemAt: ["$taskCount.total", 0] }, 0],
          },
        },
      },
      {
        $project: {
          taskCount: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "manager",
          foreignField: "_id",
          as: "manager",
        },
      },
      {
        $unwind: { path: "$manager", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "team_lead",
          foreignField: "_id",
          as: "team_lead",
        },
      },
      {
        $unwind: { path: "$team_lead", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "created_by",
        },
      },
      {
        $unwind: { path: "$created_by", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "team_members",
          foreignField: "_id",
          as: "team_members",
        },
      },
    ]);
    const data = {
      tasks: teamWithTask[0]?.tasks,
      totalRecord: teamWithTask[0]?.totalTasks,
      team_title: teamWithTask[0]?.team_title,
      team_members: teamWithTask[0]?.team_members,
      team_lead: teamWithTask[0]?.team_lead,
      manager: teamWithTask[0]?.manager,
      created_by: teamWithTask[0]?.created_by,
      limit: limit,
      page: page,
      totalPages: Math.ceil(teamWithTask[0]?.totalTasks / limit),
      _id: teamWithTask[0]?._id,
    };
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;
  try {
    const deleteTasks = await Task.findByIdAndDelete(id);
    if (!deleteTask) {
      return res.status(400).json({ messge: "Task not found." });
    }
    return res.status(200).json({ message: "Task Deleted successfully." });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
}
async function deleteTeams(req, res) {
  try {
    const response = await Team.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(400).json({ message: "Teams does not exists." });
    }
    return res.status(200).json({
      message: "Teams has been deleted.",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function getUsersTeams(req, res) {
  try {
    const response = await Users.find({ created_by: req.params.id });
    return res.status(200).json({ data: response });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error." });
  }
}

async function createTaskForTeam(req, res) {
  const {
    title,
    description,
    created_by,
    assigned_to,
    team_id,
    status,
    priority,
  } = req.body;
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
  if (!team_id) {
    return res.staus(400).json({
      message: "Please select a team!",
    });
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const task = new Task({
      title,
      description,
      created_by,
      assigned_to,
      team_id,
      status,
      priority,
      assigned_by: created_by,
    });
    await task.save({ session });
    if (!task) {
      return res.status(400).json({ message: "Some thing went wrong! " });
    }
    const updatedUser = await Users.findByIdAndUpdate(
      created_by,
      {
        $addToSet: {
          assigned_task: task?._id,
        },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({ task, updatedUser });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function updateTaskForTeam(req, res) {
  const {
    title,
    description,
    created_by,
    assigned_to,
    team_id,
    status,
    priority,
  } = req.body;
  const { id } = req.params.id;
  try {
    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }
    if (!created_by) {
      return res.status(400).json({ message: "Created by id is required." });
    }
    if (!team_id) {
      return res.status(400).json({ message: "Please select a team." });
    }
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        created_by,
        assigned_to,
        due_date,
        status,
        priority,
        team_id,
      },
      { new: true } // returns the updated document
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json(updatedTask);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Please select a task." });
  }
  try {
    const deleteTask = await Task.findByIdAndDelete(id);
    if (!deleteTask) {
      return res.status(200).json({ message: "Task not found!" });
    }
    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

async function getTaskForTeams(req, res) {
  const { team_id } = req.params;
  try {
    const tasks = await Task.find({ team_id: team_id });
    return res.status(200).json(tasks);
  } catch (e) {
    return res.status(200).json({ message: e.message });
  }
}

async function assignTask(req, res) {
  try {
    const { taskId, userId, assignedById } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    const updateTask = await Task.findByIdAndUpdate(
      taskId,
      {
        assigned_to: userId,
        assigned_by: assignedById,
      },
      {
        new: true,
        session,
      }
    );

    if (!updateTask) {
      return res.status(400).json({ message: "Task not found." });
    }

    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          assigned_task: {
            task: taskId,
            assigned_at: new Date(),
          },
        },
      },
      { new: true, session }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found!" });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Task assigned successfully." });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createTeam,
  getTeams,
  deleteTeams,
  getUsersTeams,
  updateTeam,
  getSingleTeam,
  createTaskForTeam,
  updateTaskForTeam,
  getTaskForTeams,
  deleteTask,
  assignTask,
};
