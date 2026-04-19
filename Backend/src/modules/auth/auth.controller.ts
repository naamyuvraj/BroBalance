const AuthService = require('./auth.service')

const authservice = new AuthService()

class AuthController {
    static googleCallback(req: any, res: any, next: any) {
        try {
            const result = authservice.generateToken(req.user);
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 60 * 60 * 1000, // 1 hour
            });
            res.redirect(`https://w2mxl9h3-5173.inc1.devtunnels.ms/oauth/callback?token=${result.token}`);
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
            // Implement logout logic here (e.g., destroy session)
            // For demonstration, we'll just return a success message
            res.json({ message: 'User logged out successfully' });
        } catch (error) {
            next(error);
        }
    }

}
module.exports = AuthController