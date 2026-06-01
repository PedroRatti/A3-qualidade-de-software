# language: pt
Funcionalidade: Controle de ponto
  Como colaborador da empresa
  Quero registrar e acompanhar meu ponto
  Para visualizar minha jornada de trabalho

  Cenário: Visualizar resumo do dia com sucesso
    Dado que existe uma sessão autenticada de colaborador
    Quando eu acesso a tela "Overview"
    Então devo visualizar o resumo do ponto do dia
    E devo visualizar as ações disponíveis para a jornada atual

  Cenário: Registrar entrada com sucesso
    Dado que existe uma sessão autenticada de colaborador
    E que a ação "clock-in" está disponível
    Quando eu clico na ação de registrar entrada
    Então devo visualizar o resumo atualizado da jornada
    E a entrada deve aparecer nos registros do dia

  Cenário: Visualizar histórico de ponto
    Dado que existe uma sessão autenticada de colaborador
    Quando eu acesso a aba "Histórico" do módulo de ponto
    Então devo visualizar a lista do histórico de ponto

  Cenário: Administrador visualiza histórico de colaboradores
    Dado que existe uma sessão autenticada de administrador
    Quando eu acesso a aba "Histórico de Colaboradores" do módulo de ponto
    Então devo visualizar o histórico agrupado por colaborador

  Cenário: Colaborador comum não visualiza histórico de colaboradores
    Dado que existe uma sessão autenticada de colaborador
    Quando eu acesso a tela "Overview"
    Então não devo visualizar a opção "Histórico de Colaboradores"

  Cenário: Exibir erro ao falhar no carregamento do ponto
    Dado que existe uma sessão autenticada de colaborador
    E que ocorre falha ao carregar os dados do ponto
    Quando eu acesso a tela "Overview"
    Então devo visualizar a mensagem "Falha ao carregar ou registrar o ponto."
    E devo visualizar a opção "Tentar novamente"