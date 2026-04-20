const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const AuthService = require('../modules/auth/auth.service');
const { env } = require('../config/env');

const authMiddleware = (req:any, res:any, next:any) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Access denied. No token provided.', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, env.jwtSecret) as any;
        if (AuthService.isBlackListed(token)) {
            throw new AppError('Token has been blacklisted. Please login again.', 401);
        }

        req.user = { id: decoded.id };
        next();
    } catch (error:any) {
        if (error instanceof AppError) return next(error);
        if (error.name === 'JsonWebTokenError') return next(new AppError('Invalid token', 401));
        if (error.name === 'TokenExpiredError') return next(new AppError('Token expired. Please login again.', 401));
        next(new AppError('Authentication failed', 401));
    }
};

module.exports = authMiddleware
