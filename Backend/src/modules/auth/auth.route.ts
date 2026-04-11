import express from 'express'
import passport from '../../utils/passport.js'
import AuthController from './auth.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'
import { register, login } from '../../middlewares/validate.middleware.js'

const router = express.Router()

router.post('/register', register, AuthController.register)
router.post('/login', login, AuthController.login)
router.post('/logout', authMiddleware, AuthController.logout)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, res, next) => {
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

export default router