import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

interface TokenPayload {
  userId: number;
  email: string;
}

const secret: Secret = process.env.JWT_SECRET || "super_secret_123456";

const signOptions: SignOptions = {
  expiresIn: (process.env.JWT_EXPIRES || "7d") as SignOptions["expiresIn"],
};

export function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, secret, signOptions);
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded as TokenPayload;
  } catch {
    return null;
  }
}