import bcrypt from "bcryptjs";
import passport from "passport";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prismaClient.js";

async function signup(req, res) {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // check if user exists
        const dupeUser = await prisma.user.findUnique({
            where: {
                username,
            }
        });
        if(dupeUser) return res.status(409).json({ error: "Username already exists" });

        const user = await prisma.user.create({
            data: {
                username, 
                password: hashedPassword,
                provider: "LOCAL"
            }
        });

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role,
            }, 
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5m" }
        );

        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }).json({ message: "User created and logged in." });
    } catch (err) {
        console.error("Error in signUp:", err.message, err.stack);
        return res.status(500).json({
            error: "Server failed for signUp.",
        });
    }
}

async function login(req, res) {
    try {
        passport.authenticate("login", (err, user, info) => {
            if(err) return res.status(400).json({error: "Authentication failed."});
            if(!user) return res.status(401).json({error: info?.message});

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                }, 
                process.env.JWT_SECRET_KEY,
                { expiresIn: "5m" }
            );

            return res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            }).json({ message: "User logged in." });
        })(req, res);
    } catch (err) {
        console.error("Error in login:", err.message, err.stack);
        return res.status(500).json({
            error: "Server failed for login.",
        });
    }
}

async function logout(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        return res.json({ message: "User logged out." });
    } catch (err) {
        console.error("Error in logout:", err.message, err.stack);
        return res.status(500).json({
            error: "Server failed for logout.",
        });
    }
}

export function verifyToken(req, res) {
    try {
        const token = req.cookies.token;
        if(!token) return res.sendStatus(400).json({ error: "Token is missing!" });
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded || typeof decoded !== 'object') return res.status(400).json({ error: 'Token is invalid!' });

        return res.status(200).json(decoded);
    } catch (err) {
        console.error("Error in verifyToken:", err.message, err.stack);
        return res.status(500).json({
            error: "Error verifying token.",
        });
    }    
}

export const authController = {
    signup,
    login,
    logout,
    verifyToken
};