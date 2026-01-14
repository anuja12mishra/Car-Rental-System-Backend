import { Request, Response } from "express";
//request method types
export interface User {
    id?: string,
    username: string,
    password: string,
    created_at?: string
}
export interface UserToken {
    id: string,
    username: string
}
//Respanse types
export interface LoginResponse {
    success: boolean;
    data: {
        message: string;
        userId?: string ;
    };
}
export interface LoginBody {
    username: string;
    password: string;
}

// Add to your existing types
export interface JWTPayload {
    userId: string;
    username: string;
    iat?: number;
    exp?: number;
}
