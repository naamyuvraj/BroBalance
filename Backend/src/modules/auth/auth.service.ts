const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../user/user.model');
const AppError = require('../../utils/AppError');

const generateToken = (user:any) => {
    const payload = {
        id: user._id,
        email: user.email,
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'dev-jwt-secret', { expiresIn: '1h' });
}

class AuthService{
    generateToken(user:any){
        return {user,token:generateToken(user)}
    }
    async register(email:string, password:string){
        if (await User.findOne({ email })) throw new AppError('Email already in use', 409)
        const user = await User.create({ email, password })
        return {user, token: generateToken(user)}
    }
    async login(email:string, password:string){
        const user = await User.findOne({email}).select('+password')
        if (!user) throw new AppError('Invalid credentials', 401)
        if (!user.password) throw new AppError('User registered with Google, use Google login', 400)
        if (!(await bcrypt.compare(password, user.password))) throw new AppError('Invalid credentials', 401)
        const userObj = user.toJSON();
        return {user: userObj, token: generateToken(user)};
    }
    async logout(){
        return { message: 'User logged out successfully' };
    }
}

module.exports = AuthService