# 🌐 Plann.er Web

Este é o front-end do projeto **Plann.er**, um planejador de viagens moderno, desenvolvido durante o NLW Journey da Rocketseat.

A aplicação é construída com **React 19** e **Vite**, utilizando o **Tailwind CSS 4** para o estilo e o ecossistema **TanStack** para gerenciamento de rotas e dados.

---

## 🎨 Características do Projeto

- **Design Responsivo:** Interface limpa e moderna.
- **Roteamento Tipado:** Utiliza o [TanStack Router](https://tanstack.com/router) para navegação fluida e robusta.
- **Gerenciamento de Estado de API:** Dados cacheados e sincronizados com o [TanStack Query](https://tanstack.com/query).
- **Estilização com Tailwind 4:** Velocidade e personalização extrema com as ferramentas mais recentes do Tailwind.
- **Componentes de data:** [React Day Picker](https://react-day-picker.js.org/) para seleção de datas das viagens.

---

## 🚀 Como Rodar o Web

### 1. Pré-requisitos
Certifique-se de que a **API do Plann.er** esteja rodando em sua máquina (ver [README da API](../api/README.md)).

### 2. Instalar dependências
```bash
pnpm install
```

### 3. Iniciar o servidor de desenvolvimento
```bash
pnpm dev
```

O projeto estará disponível em: `http://localhost:5173` (ou a próxima porta disponível).

---

## 🛠️ Tecnologias Principais

- [React 19](https://react.dev/) - Biblioteca para interfaces.
- [Vite](https://vitejs.dev/) - Build tool extremamente rápida.
- [Tailwind CSS 4](https://tailwindcss.com/) - Framework de utilitários CSS.
- [TanStack Router & Query](https://tanstack.com/) - Navegação e Fetching de dados.
- [Axios](https://axios-http.com/) - Cliente HTTP para requisições na API.
- [Lucide React](https://lucide.dev/) - Conjunto de ícones prontos para uso.

---

## 📜 Scripts Disponíveis

| Script | Descrição |
|---|---|
| `pnpm dev` | Inicia o servidor do Vite em modo de desenvolvimento. |
| `pnpm build` | Compila o projeto para produção. |
| `pnpm lint` | Executa o ESLint para verificar a qualidade do código. |
| `pnpm preview` | Permite visualizar o build final localmente. |

---

Feito com 💜 por Alex Fernando durante o NLW Journey.
