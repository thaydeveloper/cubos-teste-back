import jwt from "jsonwebtoken";
import { JwtPayload } from "@/types/user";

const getAccessTokenSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return secret;
};

const getRefreshTokenSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined");
  return secret;
};

const ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export const generateAccessToken = (
  payload: Omit<JwtPayload, "iat" | "exp">
): string => {
  const secret = getAccessTokenSecret();
  return jwt.sign({ userId: payload.userId, email: payload.email }, secret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (
  payload: Omit<JwtPayload, "iat" | "exp">
): string => {
  const secret = getRefreshTokenSecret();
  return jwt.sign({ userId: payload.userId, email: payload.email }, secret, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  const secret = getAccessTokenSecret();
  return jwt.verify(token, secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  const secret = getRefreshTokenSecret();
  return jwt.verify(token, secret) as JwtPayload;
};

export const getRefreshTokenExpiry = (): Date => {
  const expiryMs = REFRESH_TOKEN_EXPIRY.includes("d")
    ? parseInt(REFRESH_TOKEN_EXPIRY) * 24 * 60 * 60 * 1000
    : parseInt(REFRESH_TOKEN_EXPIRY) * 60 * 60 * 1000;

  return new Date(Date.now() + expiryMs);
};
