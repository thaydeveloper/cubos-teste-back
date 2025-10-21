import { Router } from "express";
import { MovieController } from "@/controllers/movieController";
import { validateBody } from "@/middlewares/validation";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { createMovieSchema, updateMovieSchema } from "@/types/movie";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Filmes
 *   description: Endpoints para gerenciamento de filmes
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     tags: [Filmes]
 *     summary: Listar filmes
 *     description: Retorna uma lista de filmes com filtros opcionais e paginação
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de itens por página
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filtrar por título (busca parcial)
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filtrar por gênero
 *       - in: query
 *         name: director
 *         schema:
 *           type: string
 *         description: Filtrar por diretor
 *       - in: query
 *         name: minDuration
 *         schema:
 *           type: integer
 *         description: Duração mínima em minutos
 *       - in: query
 *         name: maxDuration
 *         schema:
 *           type: integer
 *         description: Duração máxima em minutos
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Avaliação mínima (0-10)
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: number
 *         description: Avaliação máxima (0-10)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de lançamento inicial (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de lançamento final (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de filmes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MoviesListResponse'
 */
router.get("/", MovieController.findMany);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     tags: [Filmes]
 *     summary: Obter filme por ID
 *     description: Retorna um filme específico pelo seu ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do filme
 *     responses:
 *       200:
 *         description: Dados do filme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieResponse'
 *       404:
 *         description: Filme não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", MovieController.findById);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     tags: [Filmes]
 *     summary: Criar novo filme
 *     description: Adiciona um novo filme à lista do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - duration
 *               - releaseDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Vingadores: Ultimato"
 *               description:
 *                 type: string
 *                 example: "Os heróis mais poderosos da Terra enfrentam Thanos"
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 1200
 *                 example: 181
 *               releaseDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2019-04-26T00:00:00Z"
 *               genre:
 *                 type: string
 *                 example: "Ação"
 *               director:
 *                 type: string
 *                 example: "Anthony Russo"
 *               cast:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"]
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *                 example: 8.4
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/poster.jpg"
 *               tagline:
 *                 type: string
 *                 example: "Parte da jornada é o fim"
 *               trailerUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://www.youtube.com/watch?v=TcMBFSGVi1c"
 *     responses:
 *       201:
 *         description: Filme criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", authMiddleware, validateBody(createMovieSchema), MovieController.create);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     tags: [Filmes]
 *     summary: Atualizar filme
 *     description: Atualiza um filme (apenas o criador pode editar)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do filme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Vingadores: Ultimato - Versão Estendida"
 *               description:
 *                 type: string
 *                 example: "Versão com cenas extras dos heróis"
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 1200
 *                 example: 200
 *               releaseDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2019-04-26T00:00:00Z"
 *               genre:
 *                 type: string
 *                 example: "Ação/Aventura"
 *               director:
 *                 type: string
 *                 example: "Anthony e Joe Russo"
 *               cast:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Robert Downey Jr.", "Chris Evans"]
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *                 example: 8.5
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/new-poster.jpg"
 *               tagline:
 *                 type: string
 *                 example: "A jornada continua..."
 *               trailerUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://www.youtube.com/watch?v=TcMBFSGVi1c"
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Sem permissão para editar este filme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Filme não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", authMiddleware, validateBody(updateMovieSchema), MovieController.update);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     tags: [Filmes]
 *     summary: Excluir filme
 *     description: Remove um filme (apenas o criador pode excluir)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do filme
 *     responses:
 *       200:
 *         description: Filme excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Filme excluído com sucesso"
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Sem permissão para excluir este filme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Filme não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", authMiddleware, MovieController.delete);

export default router;
