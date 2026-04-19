const express = require('express')
const passport = require('../../utils/passport')
const AuthController = require('./auth.controller')
const authMiddleware = require('../../middlewares/auth.middleware')
const { register, login } = require('../../middlewares/validate.middleware')

const router = express.Router()

router.post('/register', register, AuthController.register)
router.post('/login', login, AuthController.login)
router.post('/logout', authMiddleware, AuthController.logout)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req: any, res: any, next: any) => {
    passport.authenticate('google', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            console.error('OAuth error:', err);
            return res.redirect('http://localhost:5173?error=oauth_error');
        }
        if (!user) {
            console.error('OAuth failed, no user. Info:', info);
            return res.redirect('http://localhost:5173?error=auth_failed');
        }
        req.user = user;
        AuthController.googleCallback(req, res, next);
    })(req, res, next);
});

module.exports = router