const jwt = require("jsonwebtoken");

exports.Auth = (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(404).json({
                msg: 'Access denied'
            })
        }
        const decode = jwt.decode(token, process.env.TOKEN);
        if (req.body._id !== decode._id) {
            return res.status(404).json({
                msg: "Access denied"
            })
        }
        req.user = decode
        next()
    } catch (error) {
        res.status(404).json({
            msg: error.message
        })
    }
}