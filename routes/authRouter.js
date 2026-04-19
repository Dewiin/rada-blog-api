import { Router } from "express";
import { authController } from "../controllers/authController.js";
import passport from "passport";
export const authRouter = Router();

authRouter.post("/signup", authController.signUp);
authRouter.post("/login", authController.login);
authRouter.get("/logout", authController.logout);
authRouter.get("/verifyToken", authController.verifyToken);