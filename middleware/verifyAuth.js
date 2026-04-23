function verifyAuth(req, res, next) {
    try {
        const token = req.cookies.token;
        if(!token) return res.sendStatus(400).json({ error: "Token is missing!" });
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded || typeof decoded !== "object") return res.status(400).json({ error: "Token is invalid!" });

        if(decoded.role !== "AUTHOR") return res.status(403).json({ error: "Forbidden" });

        next();     
    } catch (err) {
        console.error("Error in verifyAuth:", err.message, err.stack);
        return res.status(500).json({
            error: "Error verifying auth.",
        });
    }
}