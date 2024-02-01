import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import type { IUser, VerifyToken } from "../types";
import { verifyToken } from "../utils/verifyToken";

export function adminAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> | undefined {
  const token: string = req.cookies.jwt;

  if (token) {
    verifyToken(token, process.env.JWT_SECRET!, (err, decodedToken) => {
      if (err as Error) {
        return res.status(401).json({
          status: 401,
          message: "Not authorized",
          error: err as Error,
        });
      } else {
        if (!(<IUser>decodedToken).isAdmin) {
          return res.status(401).json({
            status: 401,
            message: "Not authorized as admin",
          });
        } else {
          next();
        }
      }
    });
  } else {
    return res.status(401).json({
      status: 401,
      message: "Not authorized, token not available",
    });
  }
}

export function protect(
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> | undefined {
  const token: string = req.cookies.jwt; // jwt because of in controller(utils) we set cookie as "jwt" string: res.cookie('jwt', ...)

  if (token) {
    verifyToken(token, process.env.JWT_SECRET!, (err, decodedToken) => {
      if (err as Error) {
        return res.status(401).json({
          status: 401,
          message: "Not authorized",
          error: err,
        });
      } else {
        next();
      }
    });
  } else {
    return res.status(401).json({
      status: 401,
      message: "Not authorized, token not available",
    });
  }
}
