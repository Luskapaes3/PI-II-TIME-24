-- Autor: Bernardo Garcia Barbosa
-- Carga inicial de dados do sistema

-- Cadastro dos usuários

INSERT INTO Usuario (Nome, Email, Senha, Perfil)
SELECT 'Ana Souza', 'ana.souza@pi2.com', 'Admin@123', 'Administrador'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Usuario WHERE Email = 'ana.souza@pi2.com');

INSERT INTO Usuario (Nome, Email, Senha, Perfil)
SELECT 'Bruno Lima', 'bruno.lima@pi2.com', 'Lider@123', 'Líder de Projeto'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Usuario WHERE Email = 'bruno.lima@pi2.com');

INSERT INTO Usuario (Nome, Email, Senha, Perfil)
SELECT 'Carla Mendes', 'carla.mendes@pi2.com', 'Lider@456', 'Líder de Projeto'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Usuario WHERE Email = 'carla.mendes@pi2.com');

INSERT INTO Usuario (Nome, Email, Senha, Perfil)
SELECT 'Diego Alves', 'diego.alves@pi2.com', 'Membro@123', 'Membro da Equipe'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Usuario WHERE Email = 'diego.alves@pi2.com');

INSERT INTO Usuario (Nome, Email, Senha, Perfil)
SELECT 'Elisa Rocha', 'elisa.rocha@pi2.com', 'Membro@456', 'Membro da Equipe'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Usuario WHERE Email = 'elisa.rocha@pi2.com');

INSERT INTO Usuario (Nome, Email, Senha, Perfil)
SELECT 'Felipe Costa', 'felipe.costa@pi2.com', 'Membro@789', 'Membro da Equipe'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Usuario WHERE Email = 'felipe.costa@pi2.com');
-- Cadastro dos projetos

INSERT INTO Projeto (Nome, Descricao)
SELECT 'Portal do Aluno', 'Sistema acadêmico para alunos'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Projeto WHERE Nome = 'Portal do Aluno');

INSERT INTO Projeto (Nome, Descricao)
SELECT 'Sistema Financeiro', 'Controle financeiro da empresa'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Projeto WHERE Nome = 'Sistema Financeiro');

INSERT INTO Projeto (Nome, Descricao)
SELECT 'Aplicativo Mobile', 'Aplicativo para dispositivos móveis'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Projeto WHERE Nome = 'Aplicativo Mobile');

INSERT INTO Projeto (Nome, Descricao)
SELECT 'Sistema de Estoque', 'Gerenciamento de produtos e estoque'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Projeto WHERE Nome = 'Sistema de Estoque');

INSERT INTO Projeto (Nome, Descricao)
SELECT 'Plataforma EAD', 'Plataforma de ensino a distância'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM Projeto WHERE Nome = 'Plataforma EAD');
-- Vinculos entre usuarios e projetos

INSERT INTO Pro_U_Projeto_usuario (
    fk_Projeto_ID_Projeto,
    fk_Usuario_ID_Usuario
)
SELECT p.ID_Projeto, u.ID_Usuario
FROM Projeto p
CROSS JOIN Usuario u
WHERE (
    (u.Email = 'bruno.lima@pi2.com'
        AND p.Nome IN ('Portal do Aluno', 'Sistema Financeiro'))

    OR (u.Email = 'carla.mendes@pi2.com'
        AND p.Nome IN ('Sistema Financeiro', 'Sistema de Estoque'))

    OR (u.Email = 'diego.alves@pi2.com'
        AND p.Nome = 'Plataforma EAD')

    OR (u.Email = 'elisa.rocha@pi2.com'
        AND p.Nome = 'Sistema Financeiro')

    OR (u.Email = 'felipe.costa@pi2.com'
        AND p.Nome = 'Aplicativo Mobile')
)
AND NOT EXISTS (
    SELECT 1 FROM Pro_U_Projeto_usuario v
    WHERE v.fk_Projeto_ID_Projeto = p.ID_Projeto
    AND v.fk_Usuario_ID_Usuario = u.ID_Usuario
);
-- Cadastro das demandas

INSERT INTO Demanda (
    Titulo,
    Descricao,
    Tipo,
    Prioridade,
    Status,
    Prazo_Final,
    fk_Projeto_ID_Projeto,
    fk_Usuario_ID_Usuario
)
SELECT
    d.titulo,
    d.descricao,
    d.tipo,
    d.prioridade,
    d.status,
    d.prazo,
    p.ID_Projeto,
    u.ID_Usuario
FROM (
    SELECT
        'Corrigir erro de login' titulo,
        'Erro ao entrar no sistema' descricao,
        'Defeito' tipo,
        'Crítica' prioridade,
        'Aberta' status,
        DATE '2026-10-16' prazo,
        'Portal do Aluno' projeto,
        'ana.souza@pi2.com' email
    FROM DUAL

    UNION ALL SELECT
        'Criar tela de relatórios',
        'Implementar gráficos mensais',
        'Tarefa', 'Alta', 'Em andamento',
        DATE '2026-10-30',
        'Sistema Financeiro', 'bruno.lima@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Melhorar carregamento',
        'Otimizar o carregamento da página inicial',
        'Melhoria', 'Média', 'Em revisão',
        DATE '2026-10-20',
        'Portal do Aluno', 'bruno.lima@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Documentar API',
        'Documentar as rotas de usuários',
        'Documentação', 'Baixa', 'Aberta',
        NULL,
        'Aplicativo Mobile', 'ana.souza@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Falha ao salvar perfil',
        'Erro 500 ao atualizar a foto do perfil',
        'Defeito', 'Alta', 'Aberta',
        DATE '2026-10-18',
        'Aplicativo Mobile', 'ana.souza@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Cadastrar produtos',
        'Criar formulário para cadastro de produtos',
        'Tarefa', 'Média', 'Em andamento',
        DATE '2026-10-25',
        'Sistema de Estoque', 'carla.mendes@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Adicionar recuperação de senha',
        'Permitir redefinir a senha por e-mail',
        'Melhoria', 'Alta', 'Aberta',
        DATE '2026-10-22',
        'Plataforma EAD', 'diego.alves@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Atualizar manual do sistema',
        'Incluir instruções para novos usuários',
        'Documentação', 'Baixa', 'Concluída',
        DATE '2026-10-13',
        'Sistema Financeiro', 'elisa.rocha@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Corrigir cálculo de valores',
        'Ajustar cálculo de descontos nos pagamentos',
        'Defeito', 'Crítica', 'Em andamento',
        DATE '2026-10-17',
        'Sistema Financeiro', 'carla.mendes@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Melhorar acessibilidade',
        'Adicionar recursos de acessibilidade às telas',
        'Melhoria', 'Média', 'Aberta',
        NULL,
        'Plataforma EAD', NULL
    FROM DUAL

    -- Demandas adicionais para testar o sistema

    UNION ALL SELECT
        'Corrigir falha de pagamento',
        'Resolver erro na confirmação do pagamento',
        'Defeito', 'Crítica', 'Aberta',
        TRUNC(SYSDATE) + 2,
        'Sistema Financeiro', 'elisa.rocha@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Criar tela de disciplinas',
        'Exibir as disciplinas do aluno',
        'Tarefa', 'Alta', 'Em andamento',
        TRUNC(SYSDATE) + 3,
        'Portal do Aluno', 'bruno.lima@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Melhorar menu do aplicativo',
        'Facilitar a navegação entre as telas',
        'Melhoria', 'Média', 'Em revisão',
        TRUNC(SYSDATE) + 5,
        'Aplicativo Mobile', 'felipe.costa@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Documentar cadastro de produtos',
        'Criar instruções para o cadastro',
        'Documentação', 'Baixa', 'Concluída',
        TRUNC(SYSDATE) - 1,
        'Sistema de Estoque', 'carla.mendes@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Criar notificações de aulas',
        'Notificar alunos sobre novas aulas',
        'Tarefa', 'Alta', 'Aberta',
        TRUNC(SYSDATE) + 6,
        'Plataforma EAD', 'diego.alves@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Corrigir estoque negativo',
        'Impedir valores negativos no estoque',
        'Defeito', 'Crítica', 'Em andamento',
        TRUNC(SYSDATE) + 1,
        'Sistema de Estoque', 'carla.mendes@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Alterar layout financeiro',
        'Modificar a organização da tela financeira',
        'Melhoria', 'Baixa', 'Cancelada',
        NULL,
        'Sistema Financeiro', 'elisa.rocha@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Documentar instalação',
        'Explicar como instalar o aplicativo',
        'Documentação', 'Média', 'Em revisão',
        TRUNC(SYSDATE) + 4,
        'Aplicativo Mobile', 'felipe.costa@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Criar filtro de disciplinas',
        'Permitir buscar disciplinas pelo nome',
        'Tarefa', 'Média', 'Concluída',
        TRUNC(SYSDATE) - 2,
        'Portal do Aluno', 'bruno.lima@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'Criar ranking de alunos',
        'Exibir classificação dos alunos',
        'Tarefa', 'Baixa', 'Cancelada',
        NULL,
        'Plataforma EAD', 'diego.alves@pi2.com'
    FROM DUAL
) d
JOIN Projeto p ON p.Nome = d.projeto
LEFT JOIN Usuario u ON u.Email = d.email
WHERE NOT EXISTS (
    SELECT 1 FROM Demanda existente
    WHERE existente.Titulo = d.titulo
    AND existente.fk_Projeto_ID_Projeto = p.ID_Projeto
);
-- Cadastro dos comentarios

INSERT INTO Comentario (
    Texto,
    fk_Demanda_ID_Demanda,
    fk_Usuario_ID_Usuario
)
SELECT
    c.texto,
    d.ID_Demanda,
    u.ID_Usuario
FROM (
    SELECT
        'Estamos analisando o erro.' texto,
        'Corrigir erro de login' demanda,
        'ana.souza@pi2.com' email
    FROM DUAL

    UNION ALL SELECT
        'O desenvolvimento já foi iniciado.',
        'Criar tela de relatórios',
        'bruno.lima@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'A demanda está pronta para revisão.',
        'Melhorar carregamento',
        'bruno.lima@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'O problema precisa ser resolvido com urgência.',
        'Corrigir falha de pagamento',
        'elisa.rocha@pi2.com'
    FROM DUAL

    UNION ALL SELECT
        'A documentação foi finalizada.',
        'Atualizar manual do sistema',
        'elisa.rocha@pi2.com'
    FROM DUAL
) c
JOIN Demanda d ON d.Titulo = c.demanda
JOIN Usuario u ON u.Email = c.email
WHERE NOT EXISTS (
    SELECT 1 FROM Comentario existente
    WHERE existente.Texto = c.texto
    AND existente.fk_Demanda_ID_Demanda = d.ID_Demanda
    AND existente.fk_Usuario_ID_Usuario = u.ID_Usuario
);
-- Salva os dados no banco
COMMIT;
