import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

const authMiddleware = (req:any, res:any, next:any) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Access denied. No token provided.', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-jwt-secret') as any;
        req.user = { id: decoded.id };
        next();
    } catch (error:any) {
        if (error instanceof AppError) return next(error);
        if (error.name === 'JsonWebTokenError') return next(new AppError('Invalid token', 401));
        if (error.name === 'TokenExpiredError') return next(new AppError('Token expired. Please login again.', 401));
        next(new AppError('Authentication failed', 401));
    }
};

export default authMiddleware
