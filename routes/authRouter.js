import passport from "passport"
import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js"
export const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.post("/refresh", authController.refreshToken);
authRouter.get("/me", verifyToken, authController.getCurrentUser);

authRouter.get('/google',
    passport.authenticate('google', { 
        session: false,
        scope: ['profile'],
        prompt: "select_account",
    })
);

authRouter.get('/google/callback', 
    passport.authenticate('google', { 
        session: false, 
        failureRedirect: `${process.env.CLIENT_URL}/`
    }),
    authController.googleLogin
);