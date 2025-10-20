export interface MoviePublic {
  id: string;
  title: string;
  description?: string;
  duration: number;
  releaseDate: Date;
  imageUrl?: string;
  genre?: string;
  director?: string;
  cast: string[];
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    id: string;
    name: string;
  };
}

export interface PaginatedMovies {
  movies: MoviePublic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
