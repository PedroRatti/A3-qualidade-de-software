# language: pt
Funcionalidade: Colaboradores
  Como administrador da plataforma
  Quero visualizar os colaboradores cadastrados
  Para consultar as informações da equipe

  Cenário: Administrador visualiza o botão de colaboradores na navegação
    Dado que existe uma sessão autenticada de administrador
    Quando eu acesso uma área protegida do sistema
    Então devo visualizar a opção "Colaboradores" na navegação lateral

  Cenário: Colaborador comum não visualiza o botão de colaboradores
    Dado que existe uma sessão autenticada de colaborador
    Quando eu acesso uma área protegida do sistema
    Então não devo visualizar a opção "Colaboradores" na navegação lateral

  Cenário: Administrador visualiza os cards de colaboradores
    Dado que existe uma sessão autenticada de administrador
    E que existem colaboradores cadastrados
    Quando eu acesso a tela de colaboradores
    Então devo visualizar o título "Colaboradores"
    E devo visualizar os cards com os dados da equipe

  Cenário: Exibir erro ao falhar na carga de colaboradores
    Dado que existe uma sessão autenticada de administrador
    E que ocorre erro ao carregar os colaboradores
    Quando eu acesso a tela de colaboradores
    Então devo visualizar a mensagem "Falha ao carregar colaboradores."
    E devo visualizar a mensagem detalhada retornada pela API

  Cenário: Colaborador comum é redirecionado ao tentar acessar colaboradores
    Dado que existe uma sessão autenticada de colaborador
    Quando eu tento acessar a tela de colaboradores
    Então devo ser redirecionado para a tela "Overview"