# language: pt
Funcionalidade: Solicitações internas
  Como colaborador da empresa
  Quero criar e acompanhar solicitações
  Para formalizar pedidos e enviá-los ao supervisor responsável

  Cenário: Listar supervisores disponíveis
    Dado que existe um colaborador ativo autenticado
    Quando eu consulto a lista de supervisores disponíveis
    Então a resposta deve ter status 200
    E a resposta deve conter a lista de supervisores disponíveis

  Cenário: Criar solicitação de férias com sucesso
    Dado que existe um colaborador ativo autenticado
    E que existe um supervisor administrador válido
    Quando eu envio uma solicitação de férias válida
    Então a resposta deve ter status 201
    E a resposta deve conter a mensagem "Solicitação enviada com sucesso."
    E a resposta deve conter os dados da solicitação criada

  Cenário: Criar solicitação de abono de falta com anexo
    Dado que existe um colaborador ativo autenticado
    E que existe um supervisor administrador válido
    Quando eu envio uma solicitação de abono de falta com anexo válido
    Então a resposta deve ter status 201
    E a resposta deve conter a mensagem "Solicitação enviada com sucesso."

  Cenário: Criar solicitação de abono de falta sem anexo
    Dado que existe um colaborador ativo autenticado
    E que existe um supervisor administrador válido
    Quando eu envio uma solicitação de abono de falta sem anexo
    Então a resposta deve ter status 400
    E a resposta deve conter a mensagem "É necessário anexar o atestado para abono de falta."

  Cenário: Criar solicitação com supervisor inválido
    Dado que existe um colaborador ativo autenticado
    Quando eu envio uma solicitação com supervisor inválido
    Então a resposta deve ter status 400
    E a resposta deve conter a mensagem "Supervisor inválido."

  Cenário: Criar solicitação com período inválido
    Dado que existe um colaborador ativo autenticado
    E que existe um supervisor administrador válido
    Quando eu envio uma solicitação com data inicial maior que a data final
    Então a resposta deve ter status 400
    E a resposta deve conter a mensagem "A data inicial não pode ser maior que a data final."

  Cenário: Consultar histórico de solicitações
    Dado que existe um colaborador ativo autenticado
    Quando eu consulto o histórico das minhas solicitações
    Então a resposta deve ter status 200
    E a resposta deve conter a lista das minhas solicitações

  Cenário: Administrador consulta solicitações atribuídas
    Dado que existe um administrador ativo autenticado
    Quando eu consulto as solicitações atribuídas ao supervisor logado
    Então a resposta deve ter status 200
    E a resposta deve conter a lista de solicitações atribuídas

  Cenário: Colaborador comum tenta consultar solicitações atribuídas
    Dado que existe um colaborador ativo autenticado
    Quando eu consulto as solicitações atribuídas ao supervisor logado
    Então a resposta deve ter status 403
    E a resposta deve conter a mensagem "Acesso negado."

  Cenário: Aprovar solicitação atribuída com sucesso
    Dado que existe um administrador ativo autenticado
    E que existe uma solicitação pendente atribuída a esse supervisor
    Quando eu aprovo a solicitação informada
    Então a resposta deve ter status 200
    E a resposta deve conter a mensagem "Solicitação atualizada com sucesso."
    E a resposta deve conter a solicitação com status "aprovada"

  Cenário: Revisar solicitação de outro supervisor
    Dado que existe um administrador ativo autenticado
    E que a solicitação pertence a outro supervisor
    Quando eu tento revisar a solicitação informada
    Então a resposta deve ter status 403
    E a resposta deve conter a mensagem "Solicitação não pertence ao supervisor informado."

  Cenário: Revisar solicitação já analisada
    Dado que existe um administrador ativo autenticado
    E que a solicitação já foi analisada anteriormente
    Quando eu tento revisar a solicitação informada
    Então a resposta deve ter status 409
    E a resposta deve conter a mensagem "Solicitação já analisada."

  Cenário: Consultar solicitações sem token
    Dado que a requisição não possui token de autenticação
    Quando eu consulto o histórico das minhas solicitações
    Então a resposta deve ter status 401
    E a resposta deve conter a mensagem "Token não informado."