import { prisma } from "@/config/database";
import {
  CreateMovieInput,
  UpdateMovieInput,
  MovieFilters,
} from "@/types/movie";
import { MoviePublic } from "@/types/movieResponse";

export class MovieRepository {
  static async findById(id: string): Promise<any> {
    return prisma.movie.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async create(
    data: CreateMovieInput & { userId: string }
  ): Promise<any> {
    console.log('📝 MovieRepository.create - Dados recebidos:', {
      ...data,
      userId: data.userId
    });

    const movieData: any = {
      title: data.title,
      description: data.description,
      duration: data.duration,
      releaseDate: new Date(data.releaseDate),
      imageUrl: data.imageUrl,
      genre: data.genre,
      director: data.director,
      cast: data.cast,
      rating: data.rating,
      tagline: data.tagline, // Frase de efeito
      trailerUrl: data.trailerUrl, // URL do trailer
      userId: data.userId,
    };

    console.log('📋 MovieRepository.create - movieData preparado:', movieData);

    const movie = await prisma.movie.create({
      data: movieData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return movie;
  }

  static async update(id: string, data: UpdateMovieInput): Promise<any> {
    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.releaseDate !== undefined)
      updateData.releaseDate = new Date(data.releaseDate);
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.genre !== undefined) updateData.genre = data.genre;
    if (data.director !== undefined) updateData.director = data.director;
    if (data.cast !== undefined) updateData.cast = data.cast;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.tagline !== undefined) updateData.tagline = data.tagline;
    if (data.trailerUrl !== undefined) updateData.trailerUrl = data.trailerUrl;

    return prisma.movie.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async delete(id: string): Promise<void> {
    await prisma.movie.delete({
      where: { id },
    });
  }

  static async findMany(
    filters: MovieFilters
  ): Promise<{ movies: any[]; total: number }> {
    const where: any = {};

    if (filters.title) {
      where.title = {
        contains: filters.title,
        mode: "insensitive",
      };
    }

    if (filters.genre) {
      where.genre = {
        contains: filters.genre,
        mode: "insensitive",
      };
    }

    if (filters.director) {
      where.director = {
        contains: filters.director,
        mode: "insensitive",
      };
    }

    if (filters.minDuration || filters.maxDuration) {
      where.duration = {};
      if (filters.minDuration) where.duration.gte = filters.minDuration;
      if (filters.maxDuration) where.duration.lte = filters.maxDuration;
    }

    if (filters.startDate || filters.endDate) {
      where.releaseDate = {};
      if (filters.startDate)
        where.releaseDate.gte = new Date(filters.startDate);
      if (filters.endDate) where.releaseDate.lte = new Date(filters.endDate);
    }

    if (filters.minRating || filters.maxRating) {
      where.rating = {};
      if (filters.minRating) where.rating.gte = filters.minRating;
      if (filters.maxRating) where.rating.lte = filters.maxRating;
    }

    const skip = (filters.page - 1) * filters.limit;

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: filters.limit,
      }),
      prisma.movie.count({ where }),
    ]);

    return { movies, total };
  }

  static async findUpcomingMovies(): Promise<any[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.movie.findMany({
      where: {
        releaseDate: {
          gte: today,
          lte: new Date(today.getTime() + 24 * 60 * 60 * 1000), // próximas 24h
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  static toPublic(movie: any): MoviePublic {
    return {
      id: movie.id,
      title: movie.title,
      description: movie.description,
      duration: movie.duration,
      releaseDate: movie.releaseDate,
      imageUrl: movie.imageUrl,
      genre: movie.genre,
      director: movie.director,
      cast: movie.cast,
      rating: movie.rating,
      tagline: movie.tagline, // Frase de efeito
      trailerUrl: movie.trailerUrl, // URL do trailer
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
      userId: movie.userId,
      user: {
        id: movie.user.id,
        name: movie.user.name,
      },
    };
  }
}
