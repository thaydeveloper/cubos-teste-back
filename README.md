# Movies API Backend

Backend API RESTful para gerenciamento de filmes e usuários.

## 🚀 Tecnologias

- **TypeScript** - Linguagem principal
- **Express.js** - Framework web
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação e autorização
- **AWS S3** - Armazenamento de imagens
- **Nodemailer** - Envio de e-mails
- **Zod** - Validação de dados
- **Jest** - Testes

## 📋 Pré-requisitos

- Node.js (v18+)
- PostgreSQL
- npm ou yarn

## 🔧 Configuração

1. **Clone o repositório**

   ```bash
   git clone <repository-url>
   cd teste-cubos-back
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Inicie os serviços com Docker**

   ```bash
   docker-compose up -d
   ```

5. **Configure o banco de dados**

   ```bash
   npm run db:migrate
   npm run db:generate
   ```

6. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 📚 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run start` - Inicia o servidor compilado
- `npm run db:migrate` - Executa migrações do banco
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:studio` - Abre o Prisma Studio
- `npm test` - Executa os testes
- `npm run test:watch` - Executa testes em modo watch

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

## 📋 Endpoints da API

### Autenticação

- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado

### Filmes

- `GET /api/movies` - Lista paginada de filmes
- `GET /api/movies/:id` - Detalhes do filme
- `POST /api/movies` - Criar filme
- `PUT /api/movies/:id` - Editar filme
- `DELETE /api/movies/:id` - Excluir filme

### Upload

- `POST /api/upload` - Upload de imagem

## 🏗️ Arquitetura

O projeto segue os princípios de Clean Architecture e SOLID:

- **Controllers**: Responsáveis por receber requisições e retornar respostas
- **Services**: Contêm a lógica de negócio
- **Repositories**: Abstraem o acesso aos dados
- **Middlewares**: Processam requisições (autenticação, validação, etc.)

## 🔒 Segurança

- Autenticação JWT com refresh tokens
- Rate limiting
- Helmet para headers de segurança
- Validação de dados com Zod
- CORS configurado

## 🧪 Testes

```bash
npm test              # Executa todos os testes
npm run test:watch    # Modo watch
npm run test:coverage # Cobertura de testes
```

## 📝 Licença

ISC
