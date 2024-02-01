import express, { Application, Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { userRoutes } from "./routes";

// Create the express app and import the type of app from express;
const app: Application = express();

// Cors
app.use(cors());
// Configure env:
dotenv.config();

// Parser
// Body parser middleware
// Raw json:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser:
app.use(cookieParser());

// Declate the PORT:
const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

// Users Routes
app.use("/api/users", userRoutes);

// Not Found..

// Error handler...

// Listen the server
app.listen(port, async () => {
  console.log(`🗄️ Server running at http://localhost:${port}`);

  // connect to the Database -->
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("🛢️ Connected To Database");
  } catch (error) {
    console.log("⚠️ Error to connect to Database");
  }
});
