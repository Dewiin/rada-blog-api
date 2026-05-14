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
            error: "Server error for posting comment.",
        });
    }
}

async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;

        const comment = await prisma.comment.findUnique({
            where: {
                id: parseInt(commentId)
            }
        });

        if(!comment) return res.status(404).json({ error: "Comment does not exist!" });
        if(comment.userId !== req.user.id) return res.status(403).json({ error: "Forbidden." });

        await prisma.comment.delete({
            where: {
                id: comment.id,
            }
        });

        return res.status(200).json({ message: "Comment deleted." });
    } catch(err) {
        console.error("Error in deleteComment:", err.message, err.stack);
        return res.status(500).json({
            error: "Server error for deleting comment.",
        });
    }
}

async function updateComment(req, res) {
    try {
        const { commentId } = req.params;
        const { content } = req.body; 

        let comment = await prisma.comment.findUnique({
            where: {
                id: parseInt(commentId)
            }
        });

        if(!comment) return res.status(404).json({ error: "Comment does not exist!" });
        if(comment.userId !== req.user.id) return res.status(403).json({ error: "Forbidden." });

        comment = await prisma.comment.update({
            where: {
                id: comment.id
            },
            data: {
                content,
            }
        });

        return res.status(200).json({ comment, message: "Comment edited successfully!" });
    } catch(err) {
        console.error("Error in updateComment:", err.message, err.stack);
        return res.status(500).json({
            error: "Server error for updating comment.",
        });
    }
}

export const commentsController = {
    postComment,
    deleteComment,
    updateComment
}