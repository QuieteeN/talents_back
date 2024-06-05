const jwt = require('jsonwebtoken');

verifyToken = (req, res, next) => {
    // const token = req.headers['Authorization']?.split(' ')[1] || req.cookies.accessToken;
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
        return res.status(403).send({
            message: 'No token provided!',
            status: 403
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!',
                status: 401
            });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;
