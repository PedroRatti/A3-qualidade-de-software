# EquipeHub

O **EquipeHub** e uma aplicacao web de gerenciamento de equipe voltada para o controle de ponto, acompanhamento de historico de jornada, solicitacao de ferias e apoio a decisao administrativa.

> Este README corresponde a **entrega da Sprint 1 (Pre-Projeto)**. Portanto, ele descreve o **escopo planejado**, a **ideia do produto**, as **tecnologias escolhidas** e o **estado atual do repositorio**. O documento sera atualizado nas proximas sprints conforme as funcionalidades forem sendo implementadas.

## Visao Geral

Muitas equipes ainda realizam o controle de ponto, a organizacao de ferias e o remanejamento de escalas de forma manual ou descentralizada. Isso dificulta o acompanhamento das informacoes, aumenta a chance de erros e torna a rotina administrativa mais lenta.

O EquipeHub foi proposto para centralizar essas operacoes em uma unica plataforma, oferecendo recursos especificos para dois perfis de usuario:

- **Funcionario**, com acesso ao proprio ponto, historico e solicitacoes de ferias.
- **Administrador**, com acesso a visao geral da equipe, historicos individuais, aprovacao de ferias e remanejamento de escala.

## Problema que o software busca resolver

O projeto busca reduzir a desorganizacao no gerenciamento interno de equipes, especialmente em processos como:

- registro manual ou descentralizado de ponto;
- dificuldade para consultar historico individual de jornada;
- solicitacoes de ferias sem fluxo claro de aprovacao;
- remanejamento de escala feito sem apoio de um sistema central.

## Objetivo do Projeto

Desenvolver uma aplicacao web que permita:

- registrar e acompanhar pontos dos funcionarios;
- consultar historicos individuais de jornada;
- solicitar, aprovar ou rejeitar pedidos de ferias;
- apoiar a administracao da equipe com uma visao centralizada dos colaboradores;
- remanejar escalas de forma mais organizada.

## Perfis de Usuario

### Funcionario

O funcionario tera acesso a funcionalidades relacionadas ao seu proprio vinculo com a empresa:

- bater ponto;
- visualizar o proprio historico de ponto;
- solicitar datas para ferias.

### Administrador

O administrador tera acesso a funcionalidades de gestao da equipe:

- visualizar dashboard com os funcionarios;
- consultar o historico de cada funcionario;
- aprovar ou rejeitar solicitacoes de ferias;
- remanejar a escala dos funcionarios.

## Escopo da Sprint 1

Nesta primeira sprint, o foco do grupo esta em estruturar o projeto e definir com clareza a proposta do software. Ate o momento, o repositorio contempla:

- definicao da ideia central do produto;
- identificacao do usuario-alvo;
- criacao da estrutura inicial de frontend e backend;
- integracao inicial entre a interface e a API;
- criacao de testes automatizados basicos;
- preparacao inicial da infraestrutura de banco de dados.

## Estado Atual do Projeto

Atualmente, o projeto possui os seguintes elementos implementados:

- **Frontend** em React + TypeScript + Vite;
- **Backend** em Node.js + Express + TypeScript;
- comunicacao inicial entre frontend e backend;
- teste automatizado no backend com Vitest e Supertest;
- teste automatizado end-to-end no frontend com Playwright;
- estrutura inicial de banco de dados com PostgreSQL via Docker Compose.

No estado atual, o repositorio representa a base tecnica do sistema e o planejamento funcional da aplicacao. As funcionalidades principais do produto ainda serao desenvolvidas nas proximas sprints.

## Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Banco de dados:** PostgreSQL
- **Testes:** Vitest, Supertest e Playwright
- **Containerizacao:** Docker Compose

## Estrutura do Repositorio

```text
A3-qualidade-de-software/
|-- backend/
|   |-- src/
|   |-- __tests__/
|   |-- docker-compose.yml
|   `-- package.json
|-- frontend/
|   |-- src/
|   |-- __tests__/
|   `-- package.json
`-- README.md
```

## Como executar o projeto

### Pre-requisitos

Para executar o projeto localmente, e recomendado ter instalado:

- Node.js
- npm
- Docker Desktop (opcional nesta etapa, mas util para o banco de dados)

### Executando o backend

```bash
cd backend
npm install
npm run dev
```

O backend sera iniciado em:

```text
http://localhost:3000
```

### Executando o frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend sera iniciado pelo Vite em uma porta local, normalmente:

```text
http://localhost:5173
```

### Banco de dados

O repositorio ja possui configuracao inicial de PostgreSQL com Docker Compose:

```bash
cd backend
docker compose up -d
```

Nesta Sprint 1, essa estrutura serve como preparacao para a evolucao do sistema nas proximas entregas.

## Testes

### Testes do backend

```bash
cd backend
npm test
```

### Testes do frontend

```bash
cd frontend
npm run test:e2e
```

> Observacao: para os testes end-to-end do frontend funcionarem corretamente, o backend deve estar em execucao na porta `3000`.

## Planejamento das proximas sprints

### Sprint 2

Implementacao das funcionalidades principais do sistema, com foco em:

- autenticacao e separacao de perfis;
- registro de ponto;
- consulta de historico;
- solicitacao e analise de ferias;
- dashboard administrativo;
- ampliacao da cobertura de testes.

### Sprint 3

Conclusao e refinamento da aplicacao, com foco em:

- ajustes finais de usabilidade e integracao;
- consolidacao das funcionalidades;
- melhoria da documentacao;
- revisao final dos testes;
- preparacao para apresentacao e demonstracao completa.

## Consideracoes Finais

O EquipeHub foi idealizado como uma solucao para melhorar a organizacao de equipes e tornar mais eficiente a gestao de ponto, ferias e escala de trabalho. Nesta Sprint 1, o objetivo principal foi definir uma proposta clara, viavel e tecnicamente estruturada para que o desenvolvimento continue de forma organizada nas proximas etapas.
