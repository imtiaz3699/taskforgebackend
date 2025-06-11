const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware")
const checkUser = require("../middleware/checkuser")
const {register,login, getUsers, getSingleUser, updateUser, deleteUser}  = require("../controller/user.controller")
const {createTask, getTask,getSingleTask, updateTask, deleteTask} = require("../controller/task.controller")
const {createTeam, getTeams, deleteTeams,getUsersTeams, updateTeam, getSingleTeam} = require("../controller/team.controller")

// auth
router.post("/auth/register",register)
router.post("/auth/create-user",authMiddleware,checkUser,register)
router.delete("/auth/delete-user/:id",authMiddleware,checkUser,deleteUser)
router.post("/auth/update-user/:id",authMiddleware,checkUser,updateUser)
router.get("/auth/get-single-user/:id",authMiddleware,checkUser,getSingleUser)
router.post("/auth/login",login)
router.get("/auth/get-users",authMiddleware,checkUser,getUsers)

// task
router.post("/task/create-task",authMiddleware,createTask);
router.put("/task/update-task/:id",authMiddleware,updateTask);
router.get("/task/get-task",authMiddleware,getTask);
router.get("/task/get-single-task/:id",authMiddleware,getSingleTask);
router.delete("/task/delete-task/:id",authMiddleware,deleteTask);


// teams
router.post("/teams/create-teams",authMiddleware,checkUser,createTeam);
router.post("/teams/update-teams/:teamId",authMiddleware,checkUser,updateTeam);
router.get("/teams/get-single-teams/:id",authMiddleware,checkUser,getSingleTeam);
router.delete("/teams/delete-teams/:id",authMiddleware,checkUser,deleteTeams);
router.get("/teams/get-teams",authMiddleware,getTeams);
router.get("/teams/get-users/:id",authMiddleware,getUsersTeams);

module.exports = router;
