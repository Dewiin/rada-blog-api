import { prisma } from "../config/prismaClient.js";

async function getAllPublishedPosts(req, res) {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true,
                authorId: req.user.id,
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
        console.error("Error in getAllPublishedPosts:", err.message, err.stack);
        return res.status(500).json({
            error: "Database query failed for getAllPublishedPosts.",
        });
    } 
}

async function getAllUnpublishedPosts(req, res) {
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: false,
                authorId: req.user.id,
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
            message: "Successfully retrieved unpublished posts.",
            posts,
        });
    } catch (err) {
        console.error("Error in getAllUnpublishedPosts:", err.message, err.stack);
        return res.status(500).json({
            error: "Database query failed for getAllUnpublishedPosts.",
        });
    } 
}

export const profileController = {
    getAllPublishedPosts,
    getAllUnpublishedPosts
}