const UserService = require('./user.service');

const userService = new UserService();

class UserController {
    static async getMe(req: any, res: any, next: any) {
        try {
            const user = await userService.getMe(req.user.id);
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    static async updateMe(req: any, res: any, next: any) {
        try {
            const { username, mobileNumber, instagramHandle } = req.body;
            const user = await userService.updateMe(req.user.id, { username, mobileNumber, instagramHandle });
            res.json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }

    static async searchUsers(req: any, res: any, next: any) {
        try {
            const query = req.query.q as string;
            const results = await userService.searchUsers(query || '');
            res.json({ success: true, data: results });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
