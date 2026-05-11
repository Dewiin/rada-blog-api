import { prisma } from "../config/prismaClient.js";

async function postComment(req, res) {
    try {
        // postId
        const { postId } = req.params;
        const { content } = req.body;

        const result = await prisma.comment.create({
            data: {
                content,
                postId: parseInt(postId),
                userId: req.user.id,
            },
            include: {
                user: true,
            }
        });

        if(!result) return res.status(404).json({ error: "Post does not exist" }); 
        return res.status(200).json({ result, message: "Comment successfully posted!" });
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