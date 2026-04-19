// jwt.ts — centralize all token stuff here
//
// right now token generation lives inline in auth.service.ts (line ~8)
// and verification is duplicated in auth.middleware.ts
// move both here so theres one source of truth
//
// what to build:
//   signToken(userId, email) → string   (used by auth.service register/login/googleCallback)
//   verifyToken(token) → decoded payload (used by auth.middleware)
//   decodeToken(token) → payload without verification (for debugging/logging)
//
// references:
//   - auth.service.ts → jwt.sign() call on line ~12
//   - auth.middleware.ts → jwt.verify() call on line ~11
//   - config/env.ts → env.jwtSecret for the secret key
//
// hint: keep the 1h expiry for now, but later we'll want
//       refresh tokens too (see todo.md phase 8)
//
// import jwt from 'jsonwebtoken';
// import { env } from '../config/env.js';

const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function signToken(userId: string, email: string) {
    const payload = { userId, email };
    return jwt.sign(payload, env.jwtSecret, { expiresIn: '1h' });
}

function verifyToken(token: string) {
    try {
        return jwt.verify(token, env.jwtSecret);
    } catch (err) {
        throw new Error('Invalid token');
    }
}

function decodeToken(token: string) {
    return jwt.decode(token);
}

module.exports = { signToken, verifyToken, decodeToken };