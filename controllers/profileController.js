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
                    },
                },
                claps: true,
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
            error: "Server error getting published posts.",
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
                },
                claps: true,
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
            error: "Server error getting unpublished posts.",
        });
    } 
}

async function getActivity(req, res) {
    try {
        // claps
        const claps = await prisma.clap.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                post: {
                    include: {
                        author: true,
                        claps: true,
                        comments: true,
                    }
                }
            },
            orderBy: {
                updatedAt: "desc",
            }
        });

        // comments
        const comments = await prisma.comment.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                post: {
                    include: {
                        author: true,
                        comments: true,
                        claps: true,
                    }
                }
            },
            orderBy: {
                updatedAt: "desc"
            }
        });

        const clapsActivity = claps.map((clap) => (
            {
                ...clap.post,
                type: "clap",
                updatedAt: clap.updatedAt
            }
        ));
        const commentsActivity = comments.map((comment) => (
            {
                ...comment.post,
                type: "comment",
                updatedAt: comment.updatedAt
            }
        ));

        const activity = [
            ...clapsActivity,
            ...commentsActivity,
        ].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)   
        );

        return res.status(200).json({ 
            activity, 
            message: "Activity fetched successfully!" 
        });
    } catch (err) {
        console.error("Error in getActivity:", err.message, err.stack);
        return res.status(500).json({
            error: "Server error in getting user activity.",
        });
    }
}

export const profileController = {
    getAllPublishedPosts,
    getAllUnpublishedPosts,
    getActivity
}