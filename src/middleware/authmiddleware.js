const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
    const token = req?.headers.authorization?.split(" ")[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    req.user = decoded
    if (!token) {
        return res.status(401).json({
            message: "Please login to proceed further."
        })
    }
    next();
}


module.exports = authMiddleware