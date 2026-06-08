# EquipeHub

EquipeHub é uma aplicação web para autenticação, controle de jornada, solicitações internas e consulta administrativa de equipe. O projeto está dividido em `frontend` e `backend`, usa PostgreSQL no backend e possui testes automatizados e workflows de CI.

## O que existe hoje

O código atual entrega:

- login com JWT;
- persistência de sessão no `localStorage`;
- rotas protegidas no frontend;
- área administrativa protegida por perfil;
- módulo de ponto com resumo do dia;
- registro de entrada, pausa, retorno e saída;
- histórico individual de ponto;
- histórico de ponto da equipe para administradores;
- módulo de solicitações com supervisor, período, motivo e anexo;
- histórico das solicitações do colaborador;
- aprovação e rejeição de solicitações atribuídas ao supervisor;
- diretório de colaboradores para administradores;
- notificações por polling para mudanças no fluxo de solicitações.

## Perfis de acesso

### Colaborador

- faz login;
- registra ponto;
- consulta o próprio histórico de ponto;
- cria solicitações;
- acompanha o histórico das próprias solicitações;
- recebe notificações quando a solicitação sai de `pendente`.

### Administrador

- possui tudo que o colaborador possui;
- consulta o histórico de ponto da equipe;
- acessa o diretório de colaboradores;
- revisa solicitações atribuídas ao próprio usuário;
- recebe notificações quando novas solicitações pendentes são atribuídas.

## Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- React Icons
- Playwright

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT
- Multer
- Vitest
- Supertest

## Estrutura do repositório

```text
A3-qualidade-de-software/
|-- .github/
|   `-- workflows/
|-- backend/
|   |-- __tests__/
|   |-- db/
|   |   `-- init/
|   |-- features/
|   |-- src/
|   |   |-- @types/
|   |   |-- controllers/
|   |   |-- database/
|   |   |-- middleware/
|   |   |-- repositories/
|   |   |-- routes/
|   |   |-- useCases/
|   |   `-- utils/
|   |-- .env.example
|   |-- docker-compose.yml
|   `-- package.json
|-- frontend/
|   |-- __tests__/
|   |-- features/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- contexts/
|   |   |-- hooks/
|   |   |-- types/
|   |   |-- utils/
|   |   `-- views/
|   |-- .env.example
|   `-- package.json
`-- README.md
```

## Fluxos implementados

### Autenticação

- endpoint `POST /auth/login`;
- token JWT com expiração de `1d`;
- token e usuário gravados em `localStorage`;
- rotas protegidas com `ProtectedRoute`;
- redirecionamento para `/overview` após login bem-sucedido.

### Controle de ponto

- resumo do dia em `GET /ponto/today`;
- registro de ações em `POST /ponto/register`;
- histórico individual em `GET /ponto/history`;
- histórico da equipe em `GET /ponto/team/history`;
- parâmetro `daysBack` aceito no histórico da equipe, com faixa válida de `1` a `90`;
- máquina de estados da jornada:
  - `clock-in` -> entrada
  - `start-break` -> saída_almoco
  - `end-break` -> entrada_almoco
  - `clock-out` -> saída

### Solicitações

- lista de supervisores em `GET /solicitacoes/supervisors`;
- criação em `POST /solicitacoes`;
- histórico do colaborador em `GET /solicitacoes/history`;
- caixa do supervisor em `GET /solicitacoes/assigned`;
- revisão em `PATCH /solicitacoes/:requestId/status`;
- tipos aceitos:
  - `ferias`
  - `abono_falta`
  - `outro`
- status usados no domínio:
  - `pendente`
  - `aprovada`
  - `rejeitada`
- `abono_falta` exige anexo.

### Colaboradores

- listagem administrativa em `GET /colaboradores`;
- exibição de nome, email, CPF, telefone, nascimento, perfil e status.

### Notificações

- contexto global no frontend;
- polling a cada `20` segundos em rotas autenticadas;
- admin acompanha `solicitacoes/assigned`;
- colaborador acompanha `solicitacoes/history`.

## Rotas do frontend

- `/` - login
- `/overview` - módulo de ponto
- `/requests` - solicitações
- `/collaborators` - diretório administrativo

## Banco de dados

O schema inicial cria:

- `users`
- `time_entries`
- `requests`

Detalhes relevantes:

- `users.role` distingue `admin` e `employee`;
- `requests.type` é validado por `CHECK`;
- `requests.status` é validado por `CHECK`;
- `requests.supervisor_id` referencia um usuário da tabela `users`.

## Seeds

As seeds de `backend/db/init` criam:

- 2 administradores ativos;
- 9 colaboradores ativos;
- histórico de ponto para dias úteis do último mês;
- solicitações de exemplo.

Credenciais úteis para ambiente local:

- `pedro.admin@example.com` / `pedro123`
- `ana.admin@example.com` / `ana123`
- `bruno.lima@example.com` / `bruno123`

## Como executar

### Pré-requisitos

- Node.js
- npm
- Docker ou Docker Desktop

### 1. Subir o banco

```bash
cd backend
docker compose up -d
```

O `docker-compose.yml` sobe um PostgreSQL 16 com:

- host: `localhost`
- porta: `5432`
- banco: `equipehub_db`
- usuário: `postgres`
- senha: `postgres`

### 2. Configurar variáveis de ambiente

Backend, arquivo `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=equipehub_db
DB_USER=postgres
DB_PASSWORD=postgres
AUTH_JWT_SECRET=dev-secret
```

Frontend, arquivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Os arquivos `.env.example` podem ser usados como base.

### 3. Instalar dependências

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

### 4. Rodar o backend

```bash
cd backend
npm run dev
```

O backend escuta em `http://localhost:3000`.

### 5. Rodar o frontend

```bash
cd frontend
npm run dev
```

O frontend sobe por padrão em `http://localhost:5173`.

## Uploads

- anexos são gravados em `backend/uploads/requests`;
- a pasta é criada automaticamente;
- o limite configurado no backend é de `5 MB`;
- o formulário do frontend permite `.pdf`, `.png`, `.jpg` e `.jpeg`.

## Scripts principais

### Backend

- `npm run dev`
- `npm run build`
- `npm start`
- `npm test`
- `npm run test:watch`

### Frontend

- `npm run dev`
- `npm run build`
- `npm run test:e2e`
- `npm run test:e2e:ui`
- `npm run test:e2e:headed`

## Testes

### Backend

Cobertura atual concentrada em:

- use cases de autenticação;
- use cases de ponto;
- use cases de solicitações;
- use case de colaboradores;
- contratos de rotas com `supertest`;
- presenter de solicitações.

Execução:

```bash
cd backend
npm test
```

### Frontend

Cobertura atual concentrada em:

- login;
- fluxo de solicitações;
- aba administrativa de solicitações;
- tela de colaboradores;
- proteção por perfil.

Execução:

```bash
cd frontend
npm run test:e2e
```

Observações sobre a suíte E2E atual:

- o Playwright sobe o frontend em `http://127.0.0.1:4173`;
- os testes atuais mockam as principais chamadas HTTP com `page.route(...)`;
- por isso, backend e banco não são obrigatórios para a suíte atual;
- para uso manual da aplicação, `VITE_API_URL` continua apontando para `http://localhost:3000`.

## BDD e especificações

O repositório mantém arquivos `.feature` em `backend/features` e `frontend/features` descrevendo os comportamentos esperados de:

- autenticação;
- ponto;
- solicitações;
- colaboradores.

## CI

Existem dois workflows em `.github/workflows`:

- `backend-ci.yml`
  - roda `npm ci`
  - roda `npm run test`
  - roda `npm run build`
- `frontend-ci.yml`
  - roda `npm ci`
  - instala Chromium do Playwright
  - executa apenas `__tests__/login.spec.test.ts`

## Observações técnicas

Pontos importantes observados no código atual:

- o backend usa porta fixa `3000`;
- as senhas ainda são comparadas em texto puro, sem hash;
- o frontend depende de `localStorage` para token e perfil;
- o diretório `dist/` do backend aparece no repositório como artefato gerado, mas a fonte de verdade continua em `backend/src`.

## Estado atual do projeto

O projeto já tem mais escopo implementado do que um README conceitual sugeriria. Hoje existe autenticação funcional, controle de ponto, históricos, fluxo de solicitações com revisão administrativa, diretório de colaboradores e notificações no frontend.

As evoluções mais naturais daqui para frente são:

- fortalecer segurança de autenticação;
- ampliar filtros e relatórios administrativos;
- aumentar a cobertura de testes além do fluxo de login no CI do frontend;
- revisar detalhes de acabamento e padronização de textos e metadados do frontend.