const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware")
const checkUser = require("../middleware/checkuser")
const {register,login, getUsers}  = require("../controller/user.controller")
const {createTask, getTask} = require("../controller/task.controller")
const {createTeam} = require("../controller/team.controller")

// auth
router.post("/auth/register",register)
router.post("/auth/login",login)
router.get("/auth/get-users",getUsers)

// task
router.post("/task/create-task",authMiddleware,createTask);
router.get("/task/get-task",authMiddleware,getTask);


// teams
router.post("/teams/create-teams",authMiddleware,checkUser,createTeam);

module.exports = router;
