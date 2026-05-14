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
            orderBy: {
                updatedAt: "desc",
            }
        });
        const clapsActivity = [];
        for(const clap of claps) {
            const post = await prisma.post.findFirst({
                where: {
                    claps: {
                        some: {
                            id: clap.id,
                        }
                    }
                },
                include: {
                    author: true,
                    comments: true,
                    claps: true,
                }
            });
            clapsActivity.push({...post, type: "clap"});
        }

        // comments
        const comments = await prisma.comment.findMany({
            where: {
                userId: req.user.id,
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        const commentsActivity = [];
        for(const comment of comments) {
            const post = await prisma.post.findFirst({
                where: {
                    comments: {
                        some: {
                            id: comment.id
                        }
                    }
                },
                include: {
                    author: true,
                    comments: true,
                    claps: true,
                }
            });
            commentsActivity.push({...post, type: "comment"});
        }

        return res.status(200).json({ 
            clapsActivity, 
            commentsActivity, 
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