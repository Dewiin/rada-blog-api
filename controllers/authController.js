import bcrypt from "bcryptjs";
import passport from "passport";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prismaClient.js";

async function signUp(req, res) {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
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
            secure: process.env.NODE_ENV === "production"
        }).json({ message: "User created and logged in." });
    } catch (err) {
        console.error("Error in signUp:", err.message, err.stack);
        return res.status(500).json({
            error: "Database query failed for signUp.",
        });
    }
}

async function login(req, res) {
    try {
        passport.authenticate("login", (err, user, info) => {
            if(err || !user) return res.status(400).json({error: "Authentication failed."});
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
                secure: process.env.NODE_ENV === "production"
            }).json({ message: "User logged in." });
        })(req, res);
    } catch (err) {
        console.error("Error in login:", err.message, err.stack);
        return res.status(500).json({
            error: "Database query failed for login.",
        });
    }
}

async function logout(req, res) {

}

export function verifyToken(req, res) {
    try {
        console.log("Cookies", req.cookies);

        const token = req.cookies.token;
        if(!token) {
            res.sendStatus(400).json({ error: "Token is missing!" });
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded || typeof decoded !== 'object') {
            return res.status(400).json({ error: 'Token is invalid!' });
        }

        return res.status(200).json(decoded);
    } catch (err) {
        console.error("Error in verifyToken:", err.message, err.stack);
        return res.status(500).json({
            error: "Error verifying token.",
        });
    }    
}

export const authController = {
    signUp,
    login,
    logout,
    verifyToken
};