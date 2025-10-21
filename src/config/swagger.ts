import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movies API",
      version: "1.0.0",
      description:
        "API RESTful para gerenciamento de filmes com autenticação JWT, upload de imagens e sistema de lembretes por e-mail",
      contact: {
        name: "Movies API Support",
        email: "support@moviesapi.com",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
        description: "Servidor de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            id: {
              type: "string",
              description: "ID único do usuário",
            },
            name: {
              type: "string",
              description: "Nome completo do usuário",
            },
            email: {
              type: "string",
              format: "email",
              description: "E-mail do usuário",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "Senha do usuário (mínimo 6 caracteres)",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação do usuário",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Data da última atualização",
            },
          },
        },
        Movie: {
          type: "object",
          required: ["title", "duration", "releaseDate"],
          properties: {
            id: {
              type: "string",
              description: "ID único do filme",
            },
            title: {
              type: "string",
              description: "Título do filme",
            },
            description: {
              type: "string",
              nullable: true,
              description: "Descrição/sinopse do filme",
            },
            duration: {
              type: "integer",
              minimum: 1,
              maximum: 1200,
              description: "Duração do filme em minutos (máximo 1200 = 20 horas)",
            },
            releaseDate: {
              type: "string",
              format: "date-time",
              description: "Data de lançamento do filme",
            },
            imageUrl: {
              type: "string",
              nullable: true,
              description: "URL da imagem/poster do filme",
            },
            genre: {
              type: "string",
              nullable: true,
              description: "Gênero do filme",
            },
            director: {
              type: "string",
              nullable: true,
              description: "Nome do diretor",
            },
            cast: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Lista do elenco principal",
            },
            rating: {
              type: "number",
              nullable: true,
              minimum: 0,
              maximum: 10,
              description: "Avaliação do filme (0-10)",
            },
            tagline: {
              type: "string",
              nullable: true,
              description: "Frase de efeito do filme",
              example: "Um herói renascerá"
            },
            trailerUrl: {
              type: "string",
              nullable: true,
              format: "uri",
              description: "URL do trailer no YouTube",
              example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            },
            userId: {
              type: "string",
              description: "ID do usuário que criou o filme",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Data de criação do registro",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Data da última atualização",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            message: {
              type: "string",
            },
            data: {
              type: "object",
              properties: {
                user: {
                  $ref: "#/components/schemas/UserResponse",
                },
                accessToken: {
                  type: "string",
                  description: "Token de acesso JWT",
                },
                refreshToken: {
                  type: "string",
                  description: "Token de atualização",
                },
              },
            },
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            email: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        MovieResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            data: {
              $ref: "#/components/schemas/Movie",
            },
          },
        },
        MoviesListResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            data: {
              type: "object",
              properties: {
                movies: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Movie",
                  },
                },
                pagination: {
                  type: "object",
                  properties: {
                    page: {
                      type: "integer",
                    },
                    limit: {
                      type: "integer",
                    },
                    total: {
                      type: "integer",
                    },
                    pages: {
                      type: "integer",
                    },
                  },
                },
              },
            },
          },
        },
        UploadResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
            },
            data: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                  description: "URL da imagem enviada",
                },
                filename: {
                  type: "string",
                  description: "Nome do arquivo",
                },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Mensagem de erro",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
              },
              description: "Detalhes dos erros de validação",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
