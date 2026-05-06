import { Router } from "express";
import { profileController } from "../controllers/profileController.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
export const profileRouter = Router();

profileRouter.get("/published", verifyAuth, profileController.getAllPublishedPosts);
profileRouter.get("/unpublished", verifyAuth, profileController.getAllUnpublishedPosts);