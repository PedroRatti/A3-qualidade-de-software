# language: pt
Funcionalidade: Autenticação
  Como usuário do sistema
  Quero realizar login
  Para acessar as funcionalidades da plataforma

  Cenário: Login realizado com sucesso
    Dado que existe um usuário administrador ativo cadastrado
    Quando eu envio email e senha válidos para login
    Então a resposta deve ter status 200
    E a resposta deve conter a mensagem "Login realizado com sucesso."
    E a resposta deve conter um token
    E a resposta deve conter os dados do usuário autenticado

  Cenário: Login com senha inválida
    Dado que existe um usuário administrador ativo cadastrado
    Quando eu envio email válido e senha inválida para login
    Então a resposta deve ter status 401
    E a resposta deve conter a mensagem "Credenciais inválidas."

  Cenário: Login com usuário não cadastrado
    Dado que não existe usuário cadastrado com o email informado
    Quando eu envio email e senha para login
    Então a resposta deve ter status 401
    E a resposta deve conter a mensagem "Credenciais inválidas."

  Cenário: Login sem informar email
    Dado que existe um usuário administrador ativo cadastrado
    Quando eu envio senha sem email para login
    Então a resposta deve ter status 400
    E a resposta deve conter a mensagem "É necessário informar o Email"

  Cenário: Login sem informar senha
    Dado que existe um usuário administrador ativo cadastrado
    Quando eu envio email sem senha para login
    Então a resposta deve ter status 400
    E a resposta deve conter a mensagem "É necessário informar a senha"

  Cenário: Login com usuário inativo
    Dado que existe um usuário administrador inativo cadastrado
    Quando eu envio email e senha válidos para login
    Então a resposta deve ter status 403
    E a resposta deve conter a mensagem "Usuário inativo."