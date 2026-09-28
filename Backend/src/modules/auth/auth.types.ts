

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