function checkUser(req, res, next) {
    const user = req.user;
    if(user.role !== "admin"){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    next();
}

module.exports = checkUser