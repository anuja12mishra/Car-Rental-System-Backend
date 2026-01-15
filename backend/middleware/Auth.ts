import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest<P = {}, ResBody = any, ReqBody = any, ReqQuery = any> 
    extends Request<P, ResBody, ReqBody, ReqQuery> {
    user?: {
        userId: string;
        username: string;
    };
}

export const authenticateToken = (
    req: AuthRequest, 
    res: Response, 
    next: NextFunction
) => {
    const token = req.cookies?.authToken;

    if (!token) {
        return res.status(401).json({ success: false, data: { message: "No token" } });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;

        req.user = { userId: decoded.userId, username: decoded.username };
        next();
    } catch (error) {
        res.status(403).json({ success: false, data: { message: "Invalid token" } });
    }
};
