// auth.types.ts — request/response types for auth endpoints
//
// keeps auth.controller and auth.service type-safe
// instead of using `any` everywhere (which they currently do)
//
// what to define:
//
// request bodies:
//   RegisterBody { email: string, password: string }
//   LoginBody    { email: string, password: string }
//
// response payloads:
//   AuthResponse { user: IUser, token: string }
//   LogoutResponse { message: string }
//
// jwt payload (whats inside the token):
//   JwtPayload { id: string, email: string, iat: number, exp: number }
//
// references:
//   - auth.controller.ts → destructures { email, password } from req.body
//   - auth.service.ts → returns { user, token } from register/login
//   - auth.middleware.ts → decoded token has { id } at minimum
//   - user.model.ts → IUser interface for the user object shape
//
// hint: once defined, update auth.controller.ts to use
//   req: Request<{}, {}, RegisterBody> instead of req: any

import type { IUser } from "../user/user.model";

export interface RegisterBody {
    email: string;
    password: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: IUser;
    token: string;
}

export interface LogoutResponse {
    message: string;
}

export interface JwtPayload {
    id: string;
    email: string;
    iat: number;
    exp: number;
}   