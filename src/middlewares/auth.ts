import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../token.js";

export interface AuthRequest extends Request {
  userId?: number;
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token não enviado",
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({
      error: "Token inválido",
    });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      error: "Token inválido",
    });
  }

  req.userId = decoded.userId;

  next();
}