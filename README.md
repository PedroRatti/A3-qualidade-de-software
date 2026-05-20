# EquipeHub

O **EquipeHub** e uma aplicacao web para controle de jornada e solicitacoes internas de equipe. O projeto hoje ja possui autenticacao, modulo de ponto, historico de jornadas e fluxo de solicitacoes com anexo e envio para supervisor. As funcionalidades administrativas mais amplas ainda fazem parte do roadmap.

## Estado atual do projeto

Atualmente o sistema possui:

- login com autenticacao via JWT;
- area protegida no frontend;
- modulo de ponto com:
  - resumo do dia;
  - registro de entrada, pausa, retorno e saida;
  - historico de ponto;
- modulo de solicitacoes com:
  - criacao de solicitacao;
  - escolha de supervisor;
  - upload de anexo;
  - historico de solicitacoes;
- banco PostgreSQL com seeds para usuarios, pontos e solicitacoes;
- testes automatizados no backend e testes end-to-end no frontend.

## Perfis de usuario

### Colaborador

Ja implementado:

- realizar login;
- bater ponto;
- consultar o historico de ponto;
- criar solicitacoes;
- anexar documentos a uma solicitacao;
- escolher qual supervisor recebera a solicitacao;
- consultar o historico das solicitacoes feitas.

### Administrador

Parcialmente presente:

- pode existir como usuario com `role = admin`;
- pode ser escolhido como supervisor no fluxo de solicitacoes.

Ainda pendente de implementacao:

- dashboard administrativo da equipe;
- visualizacao consolidada dos colaboradores;
- consulta do historico de outros funcionarios;
- aprovacao e rejeicao de solicitacoes;
- remanejamento de escala;
- demais funcionalidades de gestao descritas no planejamento original do projeto.

## Funcionalidades implementadas

### 1. Autenticacao

O login e feito por email e senha.

Backend:

- `POST /auth/login`

Frontend:

- tela de login;
- armazenamento de token em `localStorage`;
- protecao de rotas com `ProtectedRoute`.

### 2. Controle de ponto

Backend:

- `GET /ponto/today`
- `POST /ponto/register`
- `GET /ponto/history`

Frontend:

- tela principal de ponto;
- resumo da jornada atual;
- botoes de acao conforme o estado do dia;
- historico de registros.

Fluxo suportado:

- entrada;
- inicio de pausa;
- fim de pausa;
- saida.

### 3. Solicitacoes

Backend:

- `GET /solicitacoes/supervisors`
- `POST /solicitacoes`
- `GET /solicitacoes/history`

Frontend:

- tela de solicitacoes;
- formulario de nova solicitacao;
- tabs de nova solicitacao e historico;
- upload de anexo;
- selecao de supervisor.

Tipos de solicitacao atualmente previstos:

- `ferias`
- `abono_falta`
- `outro`

## Arquitetura do projeto

### Frontend

Stack:

- React
- TypeScript
- Vite
- React Router

Organizacao principal:

- `src/views/` para paginas e modulos visuais;
- `src/components/` para componentes compartilhados;
- `src/hooks/` para integracao com a API e estado;
- `src/types/` para contratos do frontend;
- `src/utils/` para protecao de rota e utilitarios.

### Backend

Stack:

- Node.js
- Express
- TypeScript
- PostgreSQL

Organizacao principal:

- `src/routes/` para definicao das rotas;
- `src/controllers/` para a camada HTTP;
- `src/useCases/` para regras de negocio;
- `src/repositories/` para acesso a dados;
- `src/utils/` para formatacao e regras auxiliares;
- `src/middleware/` para autenticacao JWT e upload.

## Banco de dados

Tabelas principais:

- `users`
- `time_entries`
- `requests`

A tabela `requests` hoje inclui:

- usuario solicitante;
- supervisor responsavel;
- tipo;
- periodo;
- motivo;
- caminho do anexo;
- status.

## Tecnologias utilizadas

- **Frontend:** React, TypeScript, Vite, React Router
- **Backend:** Node.js, Express, TypeScript
- **Banco de dados:** PostgreSQL
- **Upload de arquivos:** Multer
- **Autenticacao:** JWT
- **Testes backend:** Vitest, Supertest
- **Testes frontend:** Playwright
- **Containerizacao:** Docker Compose

## Estrutura do repositorio

```text
A3-qualidade-de-software/
|-- backend/
|   |-- __tests__/
|   |-- db/
|   |   `-- init/
|   |-- src/
|   |   |-- controllers/
|   |   |-- database/
|   |   |-- middleware/
|   |   |-- repositories/
|   |   |-- routes/
|   |   |-- useCases/
|   |   `-- utils/
|   |-- uploads/
|   |-- docker-compose.yml
|   `-- package.json
|-- frontend/
|   |-- __tests__/
|   |-- src/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- types/
|   |   |-- utils/
|   |   `-- views/
|   `-- package.json
`-- README.md
```

## Como executar

### Pre-requisitos

- Node.js
- npm
- Docker Desktop ou outro ambiente com Docker

### 1. Subir o banco

```bash
cd backend
docker compose up -d
```

### 2. Instalar dependencias do backend

```bash
cd backend
npm install
```

### 3. Rodar o backend

```bash
cd backend
npm run dev
```

API:

```text
http://localhost:3000
```

### 4. Instalar dependencias do frontend

```bash
cd frontend
npm install
```

### 5. Rodar o frontend

```bash
cd frontend
npm run dev
```

Aplicacao:

```text
http://localhost:5173
```

## Variaveis de ambiente

### Frontend

Arquivo `.env` esperado:

```env
VITE_API_URL=http://localhost:3000
```

### Backend

O backend depende de variaveis para conexao com o banco e JWT. O projeto ja possui `.env.example` para referencia.

Variaveis usadas pelo codigo:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `AUTH_JWT_SECRET`

## Seeds de desenvolvimento

O projeto possui dados iniciais para facilitar testes locais:

- usuarios de exemplo;
- historico de ponto para os dias anteriores;
- solicitacoes de exemplo.

Exemplo de usuario admin seedado:

- email: `pedro.admin@example.com`
- senha: `pedro123`

Exemplo de usuario colaborador:

- email: `ana.souza@example.com`
- senha: `ana123`

## Testes

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm run test:e2e
```

Observacao:

- para os testes E2E do frontend, o backend precisa estar rodando na porta `3000`.

## Roadmap

As proximas entregas devem focar principalmente no lado administrativo do sistema. O projeto ainda precisa implementar:

- aprovacao e rejeicao de solicitacoes por administradores;
- tela administrativa para acompanhamento da equipe;
- consulta do historico de ponto por colaborador;
- visao consolidada de solicitacoes recebidas;
- ajustes de permissao por perfil;
- melhorias de usabilidade e cobertura de testes.

## Resumo

O repositorio nao esta mais em estado apenas conceitual: hoje ele ja entrega uma base funcional para autenticacao, controle de ponto e solicitacoes internas. O principal bloco pendente e a camada administrativa completa, que continua prevista no escopo do projeto.
