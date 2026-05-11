import { Router } from "express";
import { commentsController } from "../controllers/commentsController.js";
import { verifyToken } from "../middleware/verifyToken.js";
export const commentsRouter = Router();

commentsRouter.post('/:postId', verifyToken, commentsController.postComment);
commentsRouter.delete('/:commentId', verifyToken, commentsController.deleteComment);