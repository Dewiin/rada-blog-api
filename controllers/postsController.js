import { prisma } from "../config/prismaClient.js";

// TODO: add filters
async function getAllPosts(req, res) {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true,
            },
            include: {
                author: true,
                comments: {
                    include: {
                        user: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        return res.status(200).json({
            message: "Successfully retrieved published posts.",
            posts,
        });
    } catch (err) {
        console.error("Error in getAllPosts:", err.message, err.stack);
        return res.status(500).json({
            error: "Database query failed for getAllPosts.",
        });
    } 
}

async function getPostById(req, res) {
    try {
        const { id } = req.params;

        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(id),
                published: true,
            },
            include: {
                author: true,
                comments: {
                    include: {
                        user: true,
                    }
                }
            }
        });

        if(!post) return res.status(404).json({
            error: "Post does not exist."
        });

        return res.status(200).json({
            message: "Post found successfully!",
            post
        });
    } catch (err) {
        console.error("Error in getPost:", err.message, err.stack);
        return res.status(500).json({
            error: "Database query failed for getPost.",
        });
    }
}

async function createPost(req, res) {
    try {
        const {title, subtitle, content, published, authorId} = req.body;
        const post = await prisma.post.create({
            data: {
                title,
                subtitle,
                content,
                published,
                authorId,
            }
        });

        return res.status(200).json({
            message: "Successfully created post!",
            post,
        });
    } catch (err) {
        console.error("Error in createPost:", err.message, err.stack);
        return res.status(500).json({
            error: "Server failed to create post",
        });
    }
}

async function updatePost(req, res) {
    try {
        const {title, subtitle, content, published} = req.body;
        const { id } = req.params; 
        const post = await prisma.post.update({
            where: {
                id,
            },
            data: {
                title,
                subtitle,
                content,
                published,
                updatedAt: new Date()
            }
        });

        return res.status(200).json({
            message: "Successfully updated post.",
            post,
        });
    } catch (err) {
        console.error("Error in updatePost:", err.message, err.stack);
        return res.status(500).json({
            error: "Database query failed for updatePost.",
        });
    }
}

export const postsController = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost
};