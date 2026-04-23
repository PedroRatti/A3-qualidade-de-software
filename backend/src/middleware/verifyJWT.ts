import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type AuthTokenPayload = {
    sub: number | string;
    email: string;
    role: string;
};

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Token não informado.",
        });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Token mal formatado.",
        });
    }

    const secret = process.env.AUTH_JWT_SECRET;

    if (!secret) {
        return res.status(500).json({
            message: "AUTH_JWT_SECRET não configurado.",
        });
    }

    try {
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload & AuthTokenPayload;

        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch {
        return res.status(401).json({
            message: "Token inválido ou expirado.",
        });
    }
}