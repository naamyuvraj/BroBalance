

const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function signToken(userId: string, email: string) {
    const payload = { userId, email };
    return jwt.sign(payload, env.jwtSecret, { expiresIn: '1h' });
}

function verifyToken(token: string) {
    try {
        return jwt.verify(token, env.jwtSecret);
    } catch (err) {
        throw new Error('Invalid token');
    }
}

function decodeToken(token: string) {
    return jwt.decode(token);
}

module.exports = { signToken, verifyToken, decodeToken };