import { Request, Response, NextFunction } from "express";
import { AuthService } from "@/services/authService";
import { RegisterInput, LoginInput, RefreshTokenInput } from "@/types/auth";
import { AuthenticatedRequest } from "@/middlewares/authMiddleware";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data: RegisterInput = req.body;
      const result = await AuthService.register(data);

      res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data: LoginInput = req.body;
      const result = await AuthService.login(data);

      res.status(200).json({
        success: true,
        message: "Login realizado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const data: RefreshTokenInput = req.body;
      const result = await AuthService.refreshToken(data);

      res.status(200).json({
        success: true,
        message: "Token renovado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await AuthService.getMe(req.userId!);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await AuthService.logout(refreshToken);

      res.status(200).json({
        success: true,
        message: "Logout realizado com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }
}
