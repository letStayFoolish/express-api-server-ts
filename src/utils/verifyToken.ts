import * as jwt from "jsonwebtoken";
import type { VerifyToken } from "../types";

export const verifyToken: VerifyToken = (token, secretKey, callback) => {
  jwt.verify(token, secretKey, callback);
};
