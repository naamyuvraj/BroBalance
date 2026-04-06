import express from 'express';
import cors from 'cors';
import session from 'express-session';


const app = express();

app.use(cors());
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

app.get('/', (req:any, res:any) => {
    res.json({ message: 'BroBalance API is running' });
});

const PORT = 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});