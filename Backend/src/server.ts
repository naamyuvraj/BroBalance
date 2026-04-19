require('./config/env');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./utils/passport');
const { connectDB } = require('./config/db');
const routes = require('./routes/index');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors({
    origin: 'https://w2mxl9h3-5173.inc1.devtunnels.ms',
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
        sameSite: 'none',
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