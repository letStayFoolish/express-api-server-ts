import { type IUser } from "../types";
import { Types } from "mongoose";
import { Response } from "express";

export type GenerateTokenParams = {
  res: Response;
  user: IUser;
  userId: Types.ObjectId;
};
