import { MovieRepository } from "@/repositories/movieRepository";
import {
  CreateMovieInput,
  UpdateMovieInput,
  MovieFilters,
} from "@/types/movie";
import { MoviePublic, PaginatedMovies } from "@/types/movieResponse";
import { AppError } from "@/middlewares/errorHandler";

export class MovieService {
  static async create(
    data: CreateMovieInput,
    userId: string
  ): Promise<MoviePublic> {
    const movie = await MovieRepository.create({ ...data, userId });
    return MovieRepository.toPublic(movie);
  }

  static async findById(id: string, userId?: string): Promise<MoviePublic> {
    const movie = await MovieRepository.findById(id);
    if (!movie) {
      throw new AppError("Filme não encontrado", 404);
    }

    return MovieRepository.toPublic(movie);
  }

  static async update(
    id: string,
    data: UpdateMovieInput,
    userId: string
  ): Promise<MoviePublic> {
    const movie = await MovieRepository.findById(id);
    if (!movie) {
      throw new AppError("Filme não encontrado", 404);
    }

    if (movie.userId !== userId) {
      throw new AppError("Você não tem permissão para editar este filme", 403);
    }

    const updatedMovie = await MovieRepository.update(id, data);
    return MovieRepository.toPublic(updatedMovie);
  }

  static async delete(id: string, userId: string): Promise<void> {
    const movie = await MovieRepository.findById(id);
    if (!movie) {
      throw new AppError("Filme não encontrado", 404);
    }

    if (movie.userId !== userId) {
      throw new AppError("Você não tem permissão para excluir este filme", 403);
    }

    await MovieRepository.delete(id);
  }

  static async findMany(filters: MovieFilters): Promise<PaginatedMovies> {
    const { movies, total } = await MovieRepository.findMany(filters);

    const totalPages = Math.ceil(total / filters.limit);
    const hasNext = filters.page < totalPages;
    const hasPrev = filters.page > 1;

    return {
      movies: movies.map((movie) => MovieRepository.toPublic(movie)),
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  static async getUpcomingMovies(): Promise<MoviePublic[]> {
    const movies = await MovieRepository.findUpcomingMovies();
    return movies.map((movie) => MovieRepository.toPublic(movie));
  }
}
