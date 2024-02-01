import { Types } from "mongoose";
import * as jwt from "jsonwebtoken";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  password: string;
  description: string;
  avatar: string;
  isAdmin: boolean;
  matchPasswords?: MatchPasswords;
}

export type MatchPasswords = (enteredPassword: string) => Promise<boolean>;

export type VerifyToken = (
  token: string,
  secretOrPublicKey: jwt.Secret | jwt.GetPublicKeyOrSecret,
  callback?: jwt.VerifyCallback<string | jwt.JwtPayload> | undefined
) => void;
