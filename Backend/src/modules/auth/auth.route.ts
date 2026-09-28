const express = require('express')
const passport = require('../../utils/passport')
const AuthController = require('./auth.controller')
const authMiddleware = require('../../middlewares/auth.middleware')
const { register, login } = require('../../middlewares/validate.middleware')
const { env } = require('../../config/env');

const router = express.Router()

const defaultRedirectUrl = `${env.clientUrl}/oauth/callback`;

const normalizeRedirectUrl = (redirect?: string) => {
    if (!redirect || typeof redirect !== 'string') return defaultRedirectUrl;

    try {
        const parsed = new URL(redirect);
        const webOrigin = new URL(env.clientUrl).origin;

        if (parsed.origin === webOrigin && parsed.pathname === '/oauth/callback') {
            return parsed.toString();
        }

        if (parsed.toString() === env.mobileAppRedirectUrl) {
            return parsed.toString();
        }
    } catch (error) {
        return defaultRedirectUrl;
    }

    return defaultRedirectUrl;
};

const redirectWithError = (redirectUrl: string, errorCode: string) => {
    const parsed = new URL(redirectUrl);
    parsed.searchParams.set('error', errorCode);
    return parsed.toString();
};

router.post('/register', register, AuthController.register)
router.post('/login', login, AuthController.login)
router.post('/logout', authMiddleware, AuthController.logout)

router.get('/google', (req: any, res: any, next: any) => {
    const redirectUrl = normalizeRedirectUrl(req.query.redirect as string | undefined);

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
        state: redirectUrl,
    })(req, res, next);
});

router.get('/google/callback', (req: any, res: any, next: any) => {
    const redirectUrl = normalizeRedirectUrl(req.query.state as string | undefined);

    passport.authenticate('google', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            console.error('OAuth error:', err);
            return res.redirect(redirectWithError(redirectUrl, 'auth_failed'));
        }
        if (!user) {
            console.error('OAuth failed, no user. Info:', info);
            return res.redirect(redirectWithError(redirectUrl, 'auth_failed'));
        }
        req.user = user;
        res.locals.oauthRedirectUrl = redirectUrl;
        AuthController.googleCallback(req, res, next);
    })(req, res, next);
});

module.exports = router