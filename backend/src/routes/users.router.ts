// External Dependencies
import express from "express";
import { authenticateUser } from "../controllers/UserController";

// Global Config

export const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post("/authenticate", authenticateUser);
