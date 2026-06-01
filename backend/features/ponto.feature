# language: pt
Funcionalidade: Controle de ponto
  Como colaborador da empresa
  Quero registrar e consultar meu ponto
  Para acompanhar minha jornada de trabalho

  Cenário: Consultar resumo do ponto do dia com sucesso
    Dado que existe um colaborador ativo autenticado
    Quando eu consulto o resumo do ponto do dia
    Então a resposta deve ter status 200
    E a resposta deve conter o resumo do ponto do dia

  Cenário: Registrar entrada com sucesso
    Dado que existe um colaborador ativo autenticado sem batidas no dia
    Quando eu envio a ação "clock-in" para registrar o ponto
    Então a resposta deve ter status 201
    E a resposta deve conter a mensagem "Ponto registrado com sucesso."
    E a resposta deve conter o resumo atualizado da jornada

  Cenário: Registrar ação fora da sequência permitida
    Dado que existe um colaborador ativo autenticado com jornada em andamento
    Quando eu envio uma ação de ponto fora da sequência permitida
    Então a resposta deve ter status 409
    E a resposta deve conter a mensagem "Ação de ponto não permitida para o momento atual."

  Cenário: Registrar ação de ponto inválida
    Dado que existe um colaborador ativo autenticado
    Quando eu envio uma ação de ponto inválida
    Então a resposta deve ter status 400
    E a resposta deve conter a mensagem "Ação de ponto inválida."

  Cenário: Consultar histórico de ponto com sucesso
    Dado que existe um colaborador ativo autenticado
    Quando eu consulto o histórico de ponto
    Então a resposta deve ter status 200
    E a resposta deve conter a lista de registros de ponto

  Cenário: Administrador consulta histórico da equipe
    Dado que existe um administrador ativo autenticado
    Quando eu consulto o histórico de ponto da equipe
    Então a resposta deve ter status 200
    E a resposta deve conter o histórico agrupado por colaborador

  Cenário: Colaborador comum tenta consultar histórico da equipe
    Dado que existe um colaborador ativo autenticado
    Quando eu consulto o histórico de ponto da equipe
    Então a resposta deve ter status 403
    E a resposta deve conter a mensagem "Acesso negado."

  Cenário: Consultar ponto sem token
    Dado que a requisição não possui token de autenticação
    Quando eu consulto o resumo do ponto do dia
    Então a resposta deve ter status 401
    E a resposta deve conter a mensagem "Token não informado."