import { Router } from "express";
import { authController } from "../controllers/authController.js";
export const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.get("/logout", authController.logout);
authRouter.get("/verifyToken", authController.verifyToken);