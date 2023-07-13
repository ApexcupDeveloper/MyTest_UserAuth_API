const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// get password vars from .env file
dotenv.config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return next(err)
        req.user = user
        next()
    })
}

function generateAccessToken(email) {
    return jwt.sign({ data: email }, process.env.TOKEN_SECRET, { expiresIn: '7d' });
}


module.exports = {
    authenticateToken,
    generateAccessToken,
}