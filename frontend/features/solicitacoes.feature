# language: pt
Funcionalidade: Solicitações
  Como colaborador ou administrador
  Quero criar, consultar e gerenciar solicitações
  Para acompanhar o fluxo de aprovações da equipe

  Cenário: Colaborador envia solicitação de férias com sucesso
    Dado que existe uma sessão autenticada de colaborador
    E que existem supervisores disponíveis para seleção
    Quando eu preencho uma solicitação válida de férias
    E eu clico no botão "Enviar solicitação"
    Então devo visualizar a aba de histórico de solicitações
    E devo visualizar a nova solicitação com status "Pendente"

  Cenário: Colaborador envia solicitação de abono com anexo
    Dado que existe uma sessão autenticada de colaborador
    E que existem supervisores disponíveis para seleção
    Quando eu preencho uma solicitação válida de abono de falta com anexo
    E eu clico no botão "Enviar solicitação"
    Então devo visualizar a solicitação criada no histórico
    E devo visualizar a opção "Ver anexo"

  Cenário: Visualizar histórico de solicitações
    Dado que existe uma sessão autenticada de colaborador
    E que existem solicitações no histórico
    Quando eu acesso a aba "Histórico"
    Então devo visualizar a lista de solicitações anteriores
    E devo visualizar o supervisor responsável
    E devo visualizar o anexo quando existir

  Cenário: Limpar erro do histórico ao trocar de aba
    Dado que existe uma sessão autenticada de colaborador
    E que ocorre erro ao carregar o histórico de solicitações
    Quando eu acesso a aba "Histórico"
    Então devo visualizar a mensagem "Ocorreu um erro ao buscar o histórico."
    Quando eu retorno para a aba "Nova solicitação"
    Então não devo mais visualizar a mensagem de erro
    E devo visualizar o formulário de nova solicitação

  Cenário: Administrador gerencia solicitações atribuídas
    Dado que existe uma sessão autenticada de administrador
    E que existem solicitações atribuídas pendentes
    Quando eu acesso a aba "Gerenciar Solicitações"
    Então devo visualizar a lista de solicitações atribuídas
    Quando eu aprovo uma solicitação pendente
    Então devo visualizar a solicitação com status "Aprovada"

  Cenário: Administrador rejeita solicitação atribuída
    Dado que existe uma sessão autenticada de administrador
    E que existem solicitações atribuídas pendentes
    Quando eu acesso a aba "Gerenciar Solicitações"
    E eu rejeito uma solicitação pendente
    Então devo visualizar a solicitação com status "Rejeitada"

  Cenário: Colaborador não visualiza gerenciamento de solicitações
    Dado que existe uma sessão autenticada de colaborador
    Quando eu acesso a tela de solicitações
    Então não devo visualizar a opção "Gerenciar Solicitações"