import { Router } from "express";
import { AuthController } from "@/controllers/authController";
import { validateBody } from "@/middlewares/validation";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { registerSchema, loginSchema, refreshTokenSchema } from "@/types/auth";

const router = Router();

router.post("/register", validateBody(registerSchema), AuthController.register);
router.post("/login", validateBody(loginSchema), AuthController.login);
router.post(
  "/refresh",
  validateBody(refreshTokenSchema),
  AuthController.refreshToken
);
router.get("/me", authMiddleware, AuthController.me);
router.post("/logout", AuthController.logout);

export default router;
