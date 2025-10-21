# 🎬 Movies API Backend

API RESTful para gerenciamento de filmes com autenticação JWT, upload de imagens (AWS S3), integração TMDB e notificações por e-mail.

## 🚀 Instalação Rápida

```bash
git clone <repository-url>
cd teste-cubos-back
npm install
cp .env.example .env # Configure suas variáveis
npm run db:migrate && npm run db:generate # Banco de dados
npm run dev # Inicia servidor
```

## 🔑 Principais Endpoints

- POST /api/auth/register — Cadastro
- POST /api/auth/login — Login (JWT)
- GET /api/movies — Lista filmes (filtros/paginação)
- POST /api/movies — Criar filme (auth)
- POST /api/upload/image — Upload imagem (auth)
- POST /api/email/test — Teste e-mail
- GET /api/docs — Swagger

## 🛠️ Configuração

- Node.js v18+
- PostgreSQL
- AWS S3 (credenciais no .env)
- TMDB API Key
- Email (Ethereal para dev)

## 🗄️ Estrutura do Projeto

```
src/
├── config/          # Configurações (database, auth, etc.)
├── controllers/     # Controllers da API
├── services/        # Lógica de negócio
├── repositories/    # Acesso aos dados
├── middlewares/     # Middlewares customizados
├── routes/          # Definição de rotas
├── types/           # Tipos TypeScript
├── utils/           # Utilitários
└── server.ts        # Arquivo principal
```

## 🏗️ Arquitetura

O projeto segue Clean Architecture e princípios SOLID:

```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Controllers  │ -> │  Services     │ -> │ Repositories  │
└───────────────┘    └───────────────┘    └───────────────┘
        │                   │                   │
        v                   v                   v
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Middlewares   │    │ Utilities     │    │ Database      │
└───────────────┘    └───────────────┘    └───────────────┘
```

## 📚 Exemplos Rápidos

```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"name":"João","email":"joao@teste.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"joao@teste.com","password":"123456"}'

# Listar filmes
curl http://localhost:3000/api/movies?page=1&limit=5
```

## 🩺 Problemas Comuns

- Banco: Verifique se PostgreSQL está rodando
- JWT: Confira variáveis no .env
- S3: Cheque credenciais AWS
- E-mail: Veja logs para Preview URL

## 📖 Documentação

Swagger: http://localhost:3000/api/docs

## 📝 Licença

ISC - Projeto para aprendizado.
