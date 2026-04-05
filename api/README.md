# 🗄️ Plann.er API

Esta é a API REST do projeto **Plann.er**, um gerenciador de viagens desenvolvido durante o NLW Journey da Rocketseat.

A API é construída com **Fastify** e **TypeScript**, utilizando o **Prisma ORM** para a comunicação com o banco de dados PostgreSQL.

---

## 🛠️ Tecnologias

- [Fastify](https://www.fastify.io/) - Web framework focado em performance.
- [Prisma](https://www.prisma.io/) - ORM para Node.js e TypeScript.
- [Zod](https://zod.dev/) - Validação de esquemas e tipagem.
- [Nodemailer](https://nodemailer.com/) - Envio de e-mails para convidados.
- [Dayjs](https://day.js.org/) - Manipulação de datas.
- [Swagger](https://swagger.io/) / [Scalar](https://scalar.com/) - Documentação interativa.

---

## 🚀 Como Rodar a API

### 1. Instalar dependências
```bash
pnpm install
```

### 2. Configurar o Banco de Dados
Certifique-se de que o **Docker** esteja rodando e execute:
```bash
docker-compose up -d
```

### 3. Configurar variáveis de ambiente
Copie o arquivo de exemplo e preencha as variáveis necessárias (URL do Banco de Dados, etc.):
```bash
cp .env.example .env
```

### 4. Rodar as migrações do Prisma
```bash
pnpm db:migrate
```

### 5. Iniciar o servidor
```bash
pnpm dev
```

O servidor estará disponível em: `http://localhost:3333` (ou a porta definida no seu `.env`).

---

## 📕 Documentação

A API possui documentação interativa integrada. Com o servidor rodando, acesse:

- **Swagger UI (V1):** [http://localhost:3333/docs/v1](http://localhost:3333/docs/v1)
- **Scalar API Reference (V2):** [http://localhost:3333/docs/v2](http://localhost:3333/docs/v2)

---

## 📜 Scripts Disponíveis

| Script | Descrição |
|---|---|
| `pnpm dev` | Inicia o servidor em modo de desenvolvimento (com tsx watch). |
| `pnpm db:migrate` | Executa as migrações pendentes no banco de dados. |
| `pnpm db:generate` | Gera o cliente do Prisma. |
| `pnpm db:studio` | Abre o Prisma Studio para visualizar os dados do banco. |

---

Feito com 💜 por Alex Fernando durante o NLW Journey.
