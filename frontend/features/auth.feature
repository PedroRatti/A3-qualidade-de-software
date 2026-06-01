# language: pt
Funcionalidade: Autenticação
  Como usuário da plataforma
  Quero realizar login
  Para acessar a área protegida do sistema

  Cenário: Login realizado com sucesso
    Dado que estou na tela de login
    Quando eu informo email e senha válidos
    E eu clico no botão "Entrar"
    Então devo ser redirecionado para a tela "Overview"
    E o token da sessão deve ser armazenado
    E devo visualizar o título "Overview"

  Cenário: Login com credenciais inválidas
    Dado que estou na tela de login
    Quando eu informo email válido e senha inválida
    E eu clico no botão "Entrar"
    Então devo permanecer na tela de login
    E devo visualizar a mensagem "Credenciais inválidas."

  Cenário: Login sem informar email
    Dado que estou na tela de login
    Quando eu informo apenas a senha
    E eu clico no botão "Entrar"
    Então devo visualizar a mensagem "Email é um campo obrigatório."

  Cenário: Login sem informar senha
    Dado que estou na tela de login
    Quando eu informo apenas o email
    E eu clico no botão "Entrar"
    Então devo visualizar a mensagem "Senha é um campo obrigatório."