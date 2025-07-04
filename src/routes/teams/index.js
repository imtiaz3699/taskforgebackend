const express = require('express');
const router = express.Router();
const authMiddleware = require("../../middleware/authmiddleware")
const checkUser = require("../../middleware/checkuser")
const {createTeam, getTeams, deleteTeams,getUsersTeams, updateTeam, getSingleTeam,createTaskForTeam, getTaskForTeams, assignTask} = require("../../controller/team.controller")




router.post("/teams/create-teams",authMiddleware,checkUser,createTeam);
router.post("/teams/update-teams/:teamId",authMiddleware,checkUser,updateTeam);
router.get("/teams/get-single-teams/:id",authMiddleware,getSingleTeam);
router.delete("/teams/delete-teams/:id",authMiddleware,checkUser,deleteTeams);
router.get("/teams/get-teams",authMiddleware,getTeams);
router.get("/teams/get-users/:id",authMiddleware,getUsersTeams);






// Task
router.post("/teams/create-task",authMiddleware,createTaskForTeam);
router.get("/teams/get-task-by-team/:team_id",authMiddleware,getTaskForTeams);
router.post("/teams/assign-task",authMiddleware,assignTask)
module.exports = router;
