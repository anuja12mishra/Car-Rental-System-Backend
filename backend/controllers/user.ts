import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkUserNameExitOrNot, getUserCredentials, createNewUser } from "../models/user-db-oparation";
import { LoginBody, LoginResponse, JWTPayload, User } from "../types/User";

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-prod';
const salt = 12; 

// ✅ SIGN IN - Set JWT cookie on success
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

        const user = await getUserCredentials(username);
        if (!user) {
            return res.status(401).json({
                success: false,
                data: { message: "Invalid credentials" }
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                data: { message: "Invalid credentials" }
            });
        }

        // ✅ Generate JWT token
        const tokenPayload: JWTPayload = {
            userId: user.id,
            username
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

        // ✅ Set HTTP-only secure cookie
        res.cookie('authToken', token, {
            httpOnly: true,      // Prevent JS access (XSS protection)
            secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
            sameSite: 'strict',  // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in ms
        });

        res.status(200).json({
            success: true,
            data: { message: "Login successful", userId: user.id }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            data: { message: "Server error" }
        });
    }
};

// ✅ SIGN UP - Also set JWT cookie
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

        const userExists = await checkUserNameExitOrNot(username);
        if (userExists) {
            return res.status(400).json({
                success: false,
                data: { message: "Username already exists" }
            });
        }

        const hashedPassword = await bcrypt.hash(password, salt);
        const userId = await createNewUser(username, hashedPassword);

        // ✅ Generate and set JWT cookie (auto-login after signup)
        const tokenPayload: JWTPayload = {
            userId,
            username
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            data: { message: "User created successfully", userId }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            data: { message: error.message || "Registration failed" }
        });
    }
};

// ✅ Logout - Clear cookie
export const Logout = (req: Request, res: Response<LoginResponse>) => {
    res.clearCookie('authToken');
    res.json({
        success: true,
        data: { message: "Logged out successfully" }
    });
};
