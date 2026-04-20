const AuthService = require('./auth.service')
const { env } = require('../../config/env');

const authservice = new AuthService()


class AuthController {
    static googleCallback(req: any, res: any, next: any) {
        try {
            const result = authservice.generateToken(req.user);
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: env.nodeEnv === 'production',
                sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
                maxAge: 60 * 60 * 1000, // 1 hour
            });
            res.redirect(`${env.clientUrl}/oauth/callback?token=${result.token}`);
        } catch (error) {
            next(error);
        }
    }
    static async register(req: any, res: any, next: any) {
        try {
            const { email, password } = req.body;
            const result = await authservice.register(email, password);
            return res.status(201).json({success: true, message: 'Registration successful', data: result });
        } catch (error) {
            next(error);
        }
    }
    static async login(req: any, res: any, next: any) {
        try {
            const { email, password } = req.body;
            const result = await authservice.login(email, password);
            res.status(200).json({success: true, message: 'Login successful', data: result });
        } catch (error) {
            next(error);
        }
    }
    static async logout(req: any, res: any, next: any) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            await authservice.logout(token);
            res.json({ message: 'User logged out successfully' });
        } catch (error) {
            next(error);
        }
    }

}
module.exports = AuthController