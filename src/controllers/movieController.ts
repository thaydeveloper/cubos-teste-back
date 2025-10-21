import { Request, Response, NextFunction } from "express";
import { MovieService } from "@/services/movieService";
import {
  CreateMovieInput,
  UpdateMovieInput,
  MovieFilters,
} from "@/types/movie";
import { AuthenticatedRequest } from "@/middlewares/authMiddleware";
import { CronService } from "@/services/cronService";
import { prisma } from "@/config/database";

export class MovieController {
  static async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log('🎬 MovieController.create - userId do req:', req.userId);
      console.log('🎬 MovieController.create - body:', req.body);
      
      const data: CreateMovieInput = req.body;
      const result = await MovieService.create(data, req.userId!);

      // Buscar dados do usuário para o e-mail
      const user = await prisma.user.findUnique({
        where: { id: req.userId! },
      });

      if (user) {
        // Enviar notificação de filme adicionado (não bloquear a resposta)
        CronService.sendMovieAddedNotification(result, user).catch(
          console.error
        );
      }

      res.status(201).json({
        success: true,
        message: "Filme criado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await MovieService.findById(id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log('🔧 MovieController.update - Dados recebidos:', {
        movieId: req.params.id,
        userId: req.userId,
        userIdType: typeof req.userId,
        body: req.body
      });

      const { id } = req.params;
      const data: UpdateMovieInput = req.body;
      const result = await MovieService.update(id, data, req.userId!);

      res.status(200).json({
        success: true,
        message: "Filme atualizado com sucesso",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      await MovieService.delete(id, req.userId!);

      res.status(200).json({
        success: true,
        message: "Filme excluído com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }

  static async findMany(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: MovieFilters = {
        title: req.query.title as string,
        genre: req.query.genre as string,
        director: req.query.director as string,
        minDuration: req.query.minDuration
          ? Number(req.query.minDuration)
          : undefined,
        maxDuration: req.query.maxDuration
          ? Number(req.query.maxDuration)
          : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        minRating: req.query.minRating
          ? Number(req.query.minRating)
          : undefined,
        maxRating: req.query.maxRating
          ? Number(req.query.maxRating)
          : undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
      };

      const result = await MovieService.findMany(filters);

      res.status(200).json({
        success: true,
        data: result.movies,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
}
