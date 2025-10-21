import axios from "axios";
import { prisma } from "../src/config/database";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

// Configuração da API do TMDB
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL =
  process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const IMAGE_BASE_URL =
  `${process.env.TMDB_IMAGE_BASE_URL}/w500` ||
  "https://image.tmdb.org/t/p/w500";

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  genre_ids: number[];
  vote_average: number;
  runtime?: number;
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  tagline: string;
  genres: TMDBGenre[];
  videos?: {
    results: Array<{
      key: string;
      site: string;
      type: string;
      name: string;
    }>;
  };
  credits: {
    crew: Array<{
      job: string;
      name: string;
    }>;
    cast: Array<{
      name: string;
      order: number;
    }>;
  };
}

class TMDBSeeder {
  private genres: Record<number, string> = {};

  async initialize() {
    console.log("🎬 Iniciando população do banco com filmes do TMDB...");

    if (!TMDB_API_KEY) {
      console.error("❌ Erro: TMDB_API_KEY não encontrada no arquivo .env!");
      process.exit(1);
    }

    console.log("✅ Chave TMDB configurada");
    await this.loadGenres();
    await this.createDefaultUser();
    await this.seedMovies();
  }

  async loadGenres() {
    console.log("📋 Carregando gêneros do TMDB...");

    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=pt-BR`
      );

      response.data.genres.forEach((genre: TMDBGenre) => {
        this.genres[genre.id] = genre.name;
      });

      console.log(`✅ ${Object.keys(this.genres).length} gêneros carregados`);
    } catch (error) {
      console.error("❌ Erro ao carregar gêneros:", error);
      throw error;
    }
  }

  async createDefaultUser() {
    console.log("👤 Criando usuário padrão...");

    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@movies.com" },
    });

    if (existingUser) {
      console.log("✅ Usuário admin já existe");
      return existingUser;
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    const user = await prisma.user.create({
      data: {
        name: "Administrador",
        email: "admin@movies.com",
        password: hashedPassword,
      },
    });

    console.log("✅ Usuário admin criado (admin@movies.com / 123456)");
    return user;
  }

  async seedMovies() {
    console.log("🎭 Buscando filmes populares do TMDB...");

    const user = await prisma.user.findUnique({
      where: { email: "admin@movies.com" },
    });

    if (!user) {
      throw new Error("Usuário admin não encontrado");
    }

    try {
      // Buscar filmes populares (múltiplas páginas para ter mais variedade)
      const movies: TMDBMovieDetails[] = [];

      for (let page = 1; page <= 3; page++) {
        console.log(`📄 Buscando página ${page} de filmes populares...`);

        const response = await axios.get(
          `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`
        );

        const popularMovies = response.data.results.slice(0, 17); // ~50 filmes no total

        for (const movie of popularMovies) {
          const movieDetails = await this.getMovieDetails(movie.id);
          if (movieDetails) {
            movies.push(movieDetails);
          }

          // Delay para não sobrecarregar a API
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      console.log(
        `🎬 ${movies.length} filmes encontrados. Salvando no banco...`
      );

      // Salvar filmes no banco
      for (const movie of movies) {
        await this.saveMovie(movie, user.id);
      }

      console.log(`✅ ${movies.length} filmes salvos com sucesso!`);
    } catch (error) {
      console.error("❌ Erro ao buscar filmes:", error);
      throw error;
    }
  }

  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails | null> {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=pt-BR&append_to_response=credits,videos`
      );

      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao buscar detalhes do filme ${movieId}:`, error);
      return null;
    }
  }

  async saveMovie(tmdbMovie: TMDBMovieDetails, userId: string) {
    try {
      // Verificar se o filme já existe
      const existingMovie = await prisma.movie.findFirst({
        where: { title: tmdbMovie.title },
      });

      if (existingMovie) {
        console.log(`⏭️  Filme "${tmdbMovie.title}" já existe, pulando...`);
        return;
      }

      // Extrair diretor
      const director =
        tmdbMovie.credits?.crew?.find((person) => person.job === "Director")
          ?.name || null;

      // Extrair elenco principal (primeiros 5)
      const cast =
        tmdbMovie.credits?.cast
          ?.sort((a, b) => a.order - b.order)
          ?.slice(0, 5)
          ?.map((actor) => actor.name) || [];

      // Extrair gênero principal
      const mainGenre = tmdbMovie.genres?.[0]?.name || "Não classificado";

      // Construir URL da imagem
      const imageUrl = tmdbMovie.poster_path
        ? `${IMAGE_BASE_URL}${tmdbMovie.poster_path}`
        : null;

      // Garantir que temos uma data válida
      const releaseDate = tmdbMovie.release_date
        ? new Date(tmdbMovie.release_date)
        : new Date();

      // Duração (padrão 120 min se não informado)
      const duration = tmdbMovie.runtime || 120;

      // Avaliação (convertida de 0-10 para 0-10)
      const rating = tmdbMovie.vote_average
        ? Math.round(tmdbMovie.vote_average * 10) / 10
        : null;

      // Extrair trailer do YouTube
      const youtubeTrailer = tmdbMovie.videos?.results?.find(
        (video) =>
          video.site === "YouTube" &&
          (video.type === "Trailer" || video.type === "Teaser")
      );
      const trailerUrl = youtubeTrailer
        ? `https://www.youtube.com/watch?v=${youtubeTrailer.key}`
        : null;

      const movieData: any = {
        title: tmdbMovie.title,
        description: tmdbMovie.overview || null,
        duration: duration,
        releaseDate: releaseDate,
        imageUrl: imageUrl,
        genre: mainGenre,
        director: director,
        cast: cast,
        rating: rating,
        tagline: tmdbMovie.tagline || null,
        trailerUrl: trailerUrl, // URL do trailer do YouTube
        userId: userId,
      };

      await prisma.movie.create({
        data: movieData,
      });

      console.log(`✅ Filme "${tmdbMovie.title}" salvo`);
    } catch (error) {
      console.error(`❌ Erro ao salvar filme "${tmdbMovie.title}":`, error);
    }
  }
}

async function main() {
  try {
    const seeder = new TMDBSeeder();
    await seeder.initialize();

    console.log("🎉 Seed concluído com sucesso!");
    console.log("📊 Resumo:");

    const movieCount = await prisma.movie.count();
    const userCount = await prisma.user.count();

    console.log(`   - Usuários: ${userCount}`);
    console.log(`   - Filmes: ${movieCount}`);
    console.log("");
    console.log("🔑 Credenciais de acesso:");
    console.log("   Email: admin@movies.com");
    console.log("   Senha: 123456");
  } catch (error) {
    console.error("❌ Erro durante o seed:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
