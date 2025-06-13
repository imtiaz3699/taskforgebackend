const Team = require("../models/team.model");
const Users = require("../models/user.model");
const Task = require("../models/task.model");

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
  try {
    const teams = await Team.findById(req.params.id);
    return res
      .status(200)
      .json({ message: "Teams fetched successfully.", data: teams });
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
    const task = await Task.create({
      title,
      description,
      created_by,
      assigned_to,
      team_id,
      status,
      priority,
    });
    return res.status(201).json(task);
  } catch (e) {
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

async function deleteTask() {
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

async function getTaskForTeams() {
  const { team_id } = req.params;
  try {
    const tasks = await Task.find({ team_id: team_id });
    return res.status(200).json(tasks);
  } catch (e) {
    return res.status(200).json({ message: e.message });
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
  getTaskForTeams
};
