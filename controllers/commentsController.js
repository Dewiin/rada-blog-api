import { prisma } from "../config/prismaClient.js";

async function postComment(req, res) {
    try {
        // if(!req.user) return res.status(401).json({ error: "Invalid credentials." })
        console.log(req.user);

        // postId
        const { postId } = req.params;
        const { comment } = req.body;

        const result = await prisma.comment.create({
            data: {
                content: comment,
                postId,
                userId: req.user.id,
            }
        });

        if(!result) return res.status(404).json({ error: "Post does not exist" }); 
        return res.status(200).json({ comment, message: "Comment successfully posted!" });
    } catch(err) {
        console.error("Error in postComment:", err.message, err.stack);
        return res.status(500).json({
            error: "Server error for postComment.",
        });
    }
}

export const commentsController = {
    postComment,
}