import jwt from "jsonwebtoken";
import { type GenerateTokenParams } from "./types";

export function generateToken({
  res,
  user,
  userId,
}: GenerateTokenParams): void {
  const { name, email, isAdmin, avatar } = user;

  // jwt.sign(payload, secret, options)
  // payload: the payload is the first parament that you'll pass to the function. This payload holds data concerning the user, and this data should not contain sensitive information like passwords
  const token = jwt.sign(
    { name, email, isAdmin, userId, avatar },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d", // 7 days
    }
  );

  // set jwt as HTTP-Only cookie, create secure cookie
  res.cookie(process.env.TOKEN_NAME!, token, {
    httpOnly: true, // accessible only by web server
    secure: process.env.NODE_ENV !== "development", // if it is in production, it will be true. true means https
    sameSite: "strict", // cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: 7 days in ms
  });
}
