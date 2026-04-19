const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const handleErrors = (req:any, res:any, next:any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(errors.array().map((e: any) => e.msg).join('. '), 400));
    }
    next();
};

const register = [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleErrors,
];

const login = [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    handleErrors,
];

module.exports = { register, login };
