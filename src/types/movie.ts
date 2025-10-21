import { z } from "zod";

export const createMovieSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título muito longo"),
  description: z.string().optional(),
  duration: z
    .number()
    .int()
    .min(1, "Duração deve ser maior que 0")
    .max(1200, "Duração máxima: 1200 minutos (20 horas)"),
  releaseDate: z.string().datetime("Data de lançamento inválida"),
  genre: z.string().optional(),
  director: z.string().optional(),
  cast: z.array(z.string()).default([]),
  rating: z.number().min(0).max(10).optional(),
  imageUrl: z.string().url().optional(),
  tagline: z.string().optional(), // Frase de efeito
  trailerUrl: z.string().url().optional(), // URL do trailer
});

export const updateMovieSchema = createMovieSchema.partial();

export const movieFiltersSchema = z.object({
  title: z.string().optional(),
  genre: z.string().optional(),
  director: z.string().optional(),
  minDuration: z.number().int().min(0).optional(),
  maxDuration: z.number().int().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minRating: z.number().min(0).max(10).optional(),
  maxRating: z.number().min(0).max(10).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
export type UpdateMovieInput = z.infer<typeof updateMovieSchema>;
export type MovieFilters = z.infer<typeof movieFiltersSchema>;
