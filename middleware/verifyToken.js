import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
    try {
        const token = req.cookies.token;
        if(!token) return res.status(400).json({ error: "Token is missing!" });
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded || typeof decoded !== 'object') return res.status(400).json({ error: 'Token is invalid!' });

        req.user = decoded;
        
        next();
    } catch (err) {
        console.error("Unexpected error:", err);
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired" });
        }
        return res.status(500).json({ error: "Server error" });
    }    
}