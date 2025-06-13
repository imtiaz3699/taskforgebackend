const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware")
const checkUser = require("../middleware/checkuser")
const {register,login, getUsers, getSingleUser, updateUser, deleteUser}  = require("../controller/user.controller")
const {createTask, getTask,getSingleTask, updateTask, deleteTask} = require("../controller/task.controller")
const teamRoutes = require("./teams/index")
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


router.use("/",teamRoutes)


module.exports = router;
