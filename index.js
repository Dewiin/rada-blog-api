import express from "express";
import passport from "passport";
import cors from "cors"
import cookieParser from "cookie-parser"
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// routers
import { postsRouter } from "./routes/postsRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { profileRouter } from "./routes/profileRouter.js";
import { commentsRouter } from "./routes/commentsRouter.js";

// config
import "dotenv/config"
import "./config/passportConfig.js"

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({
    origin: (origin, ctx) => {
        const allowed = [
            "http://127.0.0.1:5173", 
            "http://localhost:5173",
            "https://rada-blog.vercel.app"
        ];
        if (!origin || allowed.includes(origin) || origin.endsWith(".vercel.app")) {
            ctx(null, true);
        } else {
            ctx(new Error("Not allowed by CORS: ", origin));
        }
    },
    credentials: true,
}));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Routes
app.get("/api", (req, res) => {
    res.json({
        message: "Welcome to the API."
    });
});
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/comments", commentsRouter);
app.use((req, res) => {
	res.status(404).json({ error: "Not Found" });
});

// Run
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on Port ${PORT}!`));