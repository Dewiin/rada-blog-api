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

        const accessToken = jwt.sign(
            {
                id: user.id,
                displayName: user.displayName,
                role: user.role,
            }, 
            process.env.JWT_SECRET_KEY,
            { expiresIn: "10m" }
        );
        const refreshToken = jwt.sign(
            { id: user.id }, 
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "7d" }
        );

        return res
        .status(200)
        .cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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

            const accessToken = jwt.sign(
                {
                    id: user.id,
                    displayName: user.displayName,
                    role: user.role,
                }, 
                process.env.JWT_SECRET_KEY,
                { expiresIn: "10m" }
            );

            const refreshToken = jwt.sign(
                { id: user.id },
                process.env.JWT_REFRESH_KEY,
                { expiresIn: "7d" }
            );

            return res
            .status(200)
            .cookie("token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            })
            .json({ message: "User logged in." });
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
        return res
        .clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .json({ message: "User logged out." });
    } catch (err) {
        console.error("Error in logout:", err.message, err.stack);
        return res.status(500).json({
            error: "Server failed for logout.",
        });
    }
}

async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(400).json({ error: "Token is missing!" });

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
        if (!decoded || typeof decoded !== 'object') return res.status(400).json({ error: 'Session expired!' });

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            }
        });
        if(!user) return res.status(401).json({ error: "User not found" });

        const accessToken = jwt.sign(
            {
                id: user.id,
                displayName: user.displayName,
                role: user.role,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "10m" }
        );

        return res
        .status(200)
        .cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .json({ message: "Token refreshed." })
    } catch (err) {
        console.error("Unexpected error:", err);
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Refresh token expired" });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid refresh token" });
        }
        return res.status(500).json({ error: "Server error" });
    }
}

async function googleLogin(req, res) {
    try {
        const accessToken = jwt.sign(
            {
                id: req.user.id,
                displayName: req.user.displayName,
                role: req.user.role,
            }, 
            process.env.JWT_SECRET_KEY,
            { expiresIn: "10m" }
        );

        const refreshToken = jwt.sign(
            { id: req.user.id },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "7d" }
        );

        return res
        .status(200)
        .cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .redirect(`${process.env.CLIENT_URL}/`);
    } catch (err) {
        console.error("Error in googleLogin:", err.message, err.stack);
        return res.status(500).json({
            error: "Server failed for google login.",
        });
    }
}

async function getCurrentUser(req, res) {
    if(!req.user) return res.status(404).json({ error: "No user" });
    return res.status(200).json(req.user);
}


export const authController = {
    signup,
    login,
    logout,
    refreshToken,
    getCurrentUser,
    googleLogin
};