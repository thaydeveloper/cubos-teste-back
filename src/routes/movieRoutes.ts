import { Router } from "express";
import { MovieController } from "@/controllers/movieController";
import { validateBody } from "@/middlewares/validation";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { createMovieSchema, updateMovieSchema } from "@/types/movie";

const router = Router();

router.get("/", MovieController.findMany);
router.get("/:id", MovieController.findById);
router.post(
  "/",
  authMiddleware,
  validateBody(createMovieSchema),
  MovieController.create
);
router.put(
  "/:id",
  authMiddleware,
  validateBody(updateMovieSchema),
  MovieController.update
);
router.delete("/:id", authMiddleware, MovieController.delete);

export default router;
