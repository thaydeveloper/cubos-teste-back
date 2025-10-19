<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Movies API Backend - Copilot Instructions

Este é um projeto backend de API RESTful para gerenciamento de filmes e usuários.

## Arquitetura e Padrões

- **Framework**: Express.js com TypeScript
- **ORM**: Prisma com PostgreSQL
- **Arquitetura**: Clean Architecture com separação em camadas (Controllers → Services → Repositories)
- **Autenticação**: JWT + Refresh Tokens
- **Validação**: Zod para validação de dados
- **Upload**: AWS S3 para armazenamento de imagens
- **Email**: Nodemailer para envio de e-mails

## Estrutura de Pastas

```
src/
├── config/          # Configurações (database, auth, AWS, etc.)
├── controllers/     # Controllers da API (Express handlers)
├── services/        # Lógica de negócio
├── repositories/    # Acesso aos dados (Prisma queries)
├── middlewares/     # Middlewares (auth, validation, error handling)
├── routes/          # Definição de rotas Express
├── types/           # Tipos TypeScript e schemas Zod
├── utils/           # Utilitários e helpers
└── server.ts        # Arquivo principal do servidor
```

## Padrões de Código

1. **Controllers**: Devem ser magros, apenas receber requisições e delegar para services
2. **Services**: Contêm toda lógica de negócio, validações e orquestração
3. **Repositories**: Abstraem acesso ao banco, usando Prisma
4. **Middlewares**: Para autenticação, validação, logging e tratamento de erros
5. **Tipos**: Definir interfaces TypeScript e schemas Zod para validação

## Convenções

- Use async/await para operações assíncronas
- Sempre validar dados de entrada com Zod
- Implementar tratamento de erros consistente
- Usar path aliases (@/ para src/)
- Seguir princípios SOLID
- Testes unitários com Jest

## Segurança

- Sempre validar e sanitizar inputs
- Implementar rate limiting
- Usar helmet para headers de segurança
- JWT tokens com expiração curta + refresh tokens
- Controle de permissões (usuário só pode editar seus próprios filmes)

## APIs Principais

- Authentication: register, login, refresh token, me
- Movies: CRUD completo com paginação, busca e filtros
- Upload: Integração com AWS S3
- Email: Lembretes de lançamento de filmes
