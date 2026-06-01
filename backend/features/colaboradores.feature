# language: pt
Funcionalidade: Consulta de colaboradores
  Como administrador da empresa
  Quero consultar os colaboradores cadastrados
  Para visualizar dados da equipe

  Cenário: Administrador consulta colaboradores com sucesso
    Dado que existe um administrador ativo autenticado
    Quando eu consulto a lista de colaboradores
    Então a resposta deve ter status 200
    E a resposta deve conter a lista de colaboradores cadastrados

  Cenário: Colaborador comum tenta consultar colaboradores
    Dado que existe um colaborador ativo autenticado
    Quando eu consulto a lista de colaboradores
    Então a resposta deve ter status 403
    E a resposta deve conter a mensagem "Acesso negado."

  Cenário: Usuário inativo tenta consultar colaboradores
    Dado que existe um administrador inativo autenticado
    Quando eu consulto a lista de colaboradores
    Então a resposta deve ter status 403
    E a resposta deve conter a mensagem "Usuário inativo."

  Cenário: Usuário inexistente tenta consultar colaboradores
    Dado que o usuário autenticado não existe mais na base
    Quando eu consulto a lista de colaboradores
    Então a resposta deve ter status 404
    E a resposta deve conter a mensagem "Usuário não encontrado."

  Cenário: Consultar colaboradores sem token
    Dado que a requisição não possui token de autenticação
    Quando eu consulto a lista de colaboradores
    Então a resposta deve ter status 401
    E a resposta deve conter a mensagem "Token não informado."