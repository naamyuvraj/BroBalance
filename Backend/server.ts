import './src/config/env.js';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './src/utils/passport.js';
import { connectDB } from './src/config/db.js';
import routes from './src/routes/index.js';
import errorMiddleware from './src/middlewares/error.middleware.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

app.get('/', (req: any, res: any) => {
    res.json({ message: 'BroBalance API is running' });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});