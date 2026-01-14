import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { checkUserNameExitOrNot, getUserCredentials, createNewUser } from "../models/user-db-oparation";
import { LoginBody, LoginResponse } from "../types/User";
const salt:number = process.env.SALT as unknown as number || 20;
// ✅ SIGN IN (Login) - Verify existing user
export const SignIn = async (
    req: Request<{}, {}, LoginBody>,
    res: Response<LoginResponse>
) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                data: { message: "Username and password required" }
            });
        }

        // 1. Get user credentials
        const user = await getUserCredentials(username);
        if (!user) {
            return res.status(401).json({
                success: false,
                data: { message: "Invalid credentials" }
            });
        }

        // 2. Compare password with stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                data: { message: "Invalid credentials" }
            });
        }

        res.status(200).json({
            success: true,
            data: { message: "Login successful", userId: user.id }
        });

    } catch (error) {
        console.error('SignIn error:', error);
        res.status(500).json({
            success: false,
            data: { message: "Server error" }
        });
    }
};

// ✅ SIGN UP (Register) - Create new user
export const SignUp = async (
    req: Request<{}, {}, LoginBody>,
    res: Response<LoginResponse>
) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                data: { message: "Username and password required" }
            });
        }

        // 1. Check if user already exists
        const userExists = await checkUserNameExitOrNot(username);
        if (userExists) {
            return res.status(400).json({
                success: false,
                data: { message: "Username already exists" }
            });
        }

        // 2. Hash password and create user
        const hashedPassword = await bcrypt.hash(password, salt); 
        const userId = await createNewUser(username, hashedPassword);

        res.status(201).json({
            success: true,
            data: { message: "User created successfully", userId }
        });

    } catch (error: any) {
        console.error('SignUp error:', error);
        res.status(500).json({
            success: false,
            data: { message: error.message || "Registration failed" }
        });
    }
};
