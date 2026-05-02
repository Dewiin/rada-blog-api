import { Router } from "express";
import { authController } from "../controllers/authController.js";
export const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.post("/verifyToken", authController.verifyToken);
authRouter.post("/refresh", authController.refreshToken);