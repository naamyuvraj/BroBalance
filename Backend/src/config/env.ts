const dotenv = require('dotenv');
dotenv.config();

const env = {
    port: parseInt(process.env.PORT || '8000'),
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/brobalance',
    jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret',
    sessionSecret: process.env.SESSION_SECRET || 'dev-session-secret',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = { env };
