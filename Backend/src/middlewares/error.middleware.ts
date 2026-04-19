const AppError = require('../utils/AppError');

const errorMiddleware = (err: any, req: any, res: any, next: any) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            message: `${field} already exists`,
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e: any) => e.message).join('. ');
        return res.status(400).json({
            success: false,
            message: messages,
        });
    }

    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
};

module.exports = errorMiddleware;
