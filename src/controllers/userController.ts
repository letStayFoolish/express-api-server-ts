import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import User from "../models/userModel";
import type { IUser } from "../types/index";
import { generateToken } from "../utils/generateToken";
import { Types } from "mongoose";

// @desc Auth user & get token
// @route POST /api/users/login
// @acess Public
export const authenticateUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // Login user
      const { email, password } = req.body as IUser;

      if (!email || !password) {
        return res.status(400).json({
          status: 400,
          message: "Email or Password not present",
        });
      }

      let userFounded: IUser | null;

      userFounded = await User.findOne({ email });

      if (userFounded && (await userFounded.matchPasswords!(password))) {
        // generate token:
        generateToken({
          res,
          user: userFounded,
          userId: userFounded._id,
        });
        // send user data from server to client:
        res.status(201).json({
          status: 201,
          success: true,
          message: `Wellcome back ${userFounded.name}`,
          user: {
            _id: userFounded._id,
            name: userFounded.name,
            email: userFounded.email,
            description: userFounded.description,
            avatar: userFounded.avatar,
            isAdmin: userFounded.isAdmin,
          },
        });
      } else {
        res.status(401).json({
          status: 401,
          message: "Invalid email or password",
          error: "User not found",
        });
      }
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        res.status(400).json({
          status: 400,
          message: error.message.toString(),
        }) as Response;
      }
    }
  }
);

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { name, email, password, avatar, description } = req.body as IUser;

      const userExist = await User.findOne({ email });

      if (userExist) {
        res.status(400).json({
          status: 400,
          message: "User already exist",
        });

        throw new Error("User already exist");
      }

      const newUser = await User.create({
        name,
        email,
        avatar,
        password,
        description,
      });

      generateToken({ res, user: newUser, userId: newUser._id });

      res.status(201).json({
        status: 201,
        success: true,
        message: "User created successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          description: newUser.description,
          isAdmin: newUser.isAdmin,
        },
      }) as Response;
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        res.status(400).json({
          status: 400,
          message: error.message.toString(),
        }) as Response;
      }
    }
  }
);

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie(process.env.TOKEN_NAME!, "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: "User successfully logged out!",
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Public
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId: Types.ObjectId = req.body._id;

    const user = await User.findById(userId);

    if (user) {
      res.status(201).json({
        status: 201,
        succes: true,
        message: "User profile",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          description: user.description,
          isAdmin: user.isAdmin,
        },
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Invalid user data",
      });

      throw new Error("Invalid user data");
    }
  }
);

// @desc    Get admin profile
// @route   GET /api/users/profile
// @access  Public
export const getAdminProfile = asyncHandler(
  async (req: Request, res: Response) => {
    res.send("Admin profile Info");
  }
);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body._id;

    const user = await User.findById(userId);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.avatar = req.body.avatar || user.avatar;
      user.description = req.body.description || user.description;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser: IUser = await user.save();

      res.status(200).json({
        status: 200,
        success: true,
        message: "Updated user",
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          description: updatedUser.description,
          isAdmin: updatedUser.isAdmin,
        },
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Invalid user data",
      });

      throw new Error("Invalid user data");
    }

    res.send(userId);
  }
);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  res.send("Delete user");
});

// @desc    Get list of all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const usersList = await User.find({});

    if (usersList) {
      return res.status(200).json({
        status: 200,
        success: true,
        usersList,
      });
    }
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      res.status(400).json({
        status: 400,
        message: "Something went wrong",
        error: error,
      });
    }
  }
});
