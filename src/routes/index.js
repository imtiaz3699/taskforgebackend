const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware")
const checkUser = require("../middleware/checkuser")
const {register,login, getUsers}  = require("../controller/user.controller")
const {createTask, getTask,getSingleTask, updateTask, deleteTask} = require("../controller/task.controller")
const {createTeam, getTeams} = require("../controller/team.controller")

// auth
router.post("/auth/register",register)
router.post("/auth/login",login)
router.get("/auth/get-users",getUsers)

// task
router.post("/task/create-task",authMiddleware,createTask);
router.put("/task/update-task/:id",authMiddleware,updateTask);
router.get("/task/get-task",authMiddleware,getTask);
router.get("/task/get-single-task/:id",authMiddleware,getSingleTask);
router.delete("/task/delete-task/:id",authMiddleware,deleteTask);


// teams
router.post("/teams/create-teams",authMiddleware,checkUser,createTeam);
router.post("/teams/get-teams",authMiddleware,getTeams);

module.exports = router;
