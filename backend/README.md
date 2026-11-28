## Estrutura

```
src/
  server.ts          ponto de entrada (Express, rotas, tratamento de erros)
  data/
    usuarios.ts      dados de teste em memória (usuários dos 3 perfis)
  routes/
    login.ts         POST /login
    usuarios.ts      GET /usuarios
```

## Rotas implementadas

### Aluno 1 – Login e usuários

Método  Rota       Descrição


POST    /login     Confere e-mail e senha e retorna o usuário e perfil
GET     /usuarios  Lista os usuários, sem as senhas

**POST /login** –(JSON):
```
{ "email": "ana.souza@pi2.com", "senha": "Admin@123" }
```

Situação                          Status  Resposta                                   


Credenciais corretas              200     `{ mensagem, usuario: { id, nome, email, perfil } }`
E-mail ou senha ausentes/vazios   400     `{ erro, mensagem }`
JSON malformado                   400     `{ erro, mensagem }`
E-mail inexistente ou senha errada  401   `{ erro, mensagem }`

**GET /usuarios** – retorna 200 com a lista de usuários (sem senha).

## Usuários de teste


E-mail                  Senha       Perfil           


ana.souza@pi2.com       Admin@123   Administrador    
bruno.lima@pi2.com      Lider@123   Líder de Projeto 
carla.mendes@pi2.com    Lider@456   Líder de Projeto 
diego.alves@pi2.com     Membro@123  Membro da Equipe 
elisa.rocha@pi2.com     Membro@456  Membro da Equipe 
felipe.costa@pi2.com    Membro@789  Membro da Equipe 

## Como testar

GET: http://localhost:3000/usuarios

```
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\"email\":\"ana.souza@pi2.com\",\"senha\":\"Admin@123\"}"
```