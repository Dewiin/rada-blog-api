import { Router } from "express";
import { apiKeysController } from "../controllers/apiKeysController.js";
import { verifyAuth } from "../middleware/verifyAuth.js";
export const apiKeysRouter = Router();

apiKeysRouter.get("/", verifyAuth, apiKeysController.getKeys);