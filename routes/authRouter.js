import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js"
export const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.post("/refresh", authController.refreshToken);
authRouter.get("/me", verifyToken, authController.getCurrentUser);