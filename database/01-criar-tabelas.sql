-- Autor: Matheus Yudi Misumi
-- Script de criação das tabelas do Sistema de Acompanhamento de Demandas (Oracle)

CREATE TABLE Usuario (
    ID_Usuario NUMBER GENERATED AS IDENTITY PRIMARY KEY,
    Email VARCHAR2(100) NOT NULL UNIQUE,
    Senha VARCHAR2(100) NOT NULL,
    Telefone VARCHAR2(20),
    Perfil VARCHAR2(50) NOT NULL,
    Nome VARCHAR2(100) NOT NULL,
    CONSTRAINT ck_usuario_perfil CHECK (Perfil IN ('Administrador', 'Líder de Projeto', 'Membro da Equipe'))
);

CREATE TABLE Projeto (
    ID_Projeto NUMBER GENERATED AS IDENTITY PRIMARY KEY,
    Nome VARCHAR2(100) NOT NULL,
    Descricao VARCHAR2(4000)
);

CREATE TABLE Demanda (
    ID_Demanda NUMBER GENERATED AS IDENTITY PRIMARY KEY,
    Titulo VARCHAR2(150) NOT NULL,
    Descricao VARCHAR2(4000) NOT NULL,
    Tipo VARCHAR2(50) NOT NULL,
    Prioridade VARCHAR2(20) NOT NULL,
    Status VARCHAR2(30) DEFAULT 'Aberta' NOT NULL,
    Data_Criacao DATE DEFAULT SYSDATE NOT NULL,
    Data_Atualizacao DATE DEFAULT SYSDATE NOT NULL, -- preenchida já na criação
    Prazo_Final DATE,
    fk_Projeto_ID_Projeto NUMBER NOT NULL,
    fk_Usuario_ID_Usuario NUMBER, -- o responsável pode ser nulo na criação (0,1)
    CONSTRAINT fk_demanda_projeto FOREIGN KEY (fk_Projeto_ID_Projeto) REFERENCES Projeto(ID_Projeto),
    CONSTRAINT fk_demanda_usuario FOREIGN KEY (fk_Usuario_ID_Usuario) REFERENCES Usuario(ID_Usuario),
    CONSTRAINT ck_demanda_tipo CHECK (Tipo IN ('Tarefa', 'Defeito', 'Melhoria', 'Documentação')),
    CONSTRAINT ck_demanda_prioridade CHECK (Prioridade IN ('Crítica', 'Alta', 'Média', 'Baixa')),
    CONSTRAINT ck_demanda_status CHECK (Status IN ('Aberta', 'Em andamento', 'Em revisão', 'Concluída',
                                                   'Cancelada'))
);

CREATE TABLE Comentario (
    ID_Comentario NUMBER GENERATED AS IDENTITY PRIMARY KEY,
    Texto VARCHAR2(4000) NOT NULL,
    Data_Hora_Comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fk_Demanda_ID_Demanda NUMBER NOT NULL,
    fk_Usuario_ID_Usuario NUMBER NOT NULL,
    CONSTRAINT fk_comentario_demanda FOREIGN KEY (fk_Demanda_ID_Demanda) REFERENCES Demanda(ID_Demanda),
    CONSTRAINT fk_comentario_usuario FOREIGN KEY (fk_Usuario_ID_Usuario) REFERENCES Usuario(ID_Usuario)
);

CREATE TABLE Historico (
    ID_Historico NUMBER GENERATED AS IDENTITY PRIMARY KEY,
    Descricao VARCHAR2(4000) NOT NULL,
    campo_alterado VARCHAR2(100),
    valor_anterior VARCHAR2(4000),
    valor_novo VARCHAR2(4000),
    Data_Hora_Historico TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fk_Demanda_ID_Demanda NUMBER NOT NULL,
    fk_Usuario_ID_Usuario NUMBER NOT NULL, -- quem fez a alteração
    CONSTRAINT fk_historico_demanda FOREIGN KEY (fk_Demanda_ID_Demanda) REFERENCES Demanda(ID_Demanda),
    CONSTRAINT fk_historico_usuario FOREIGN KEY (fk_Usuario_ID_Usuario) REFERENCES Usuario(ID_Usuario)
);

CREATE TABLE Pro_U_Projeto_usuario (
    fk_Projeto_ID_Projeto NUMBER NOT NULL,
    fk_Usuario_ID_Usuario NUMBER NOT NULL,
    CONSTRAINT pk_projeto_usuario PRIMARY KEY (fk_Projeto_ID_Projeto, fk_Usuario_ID_Usuario),
    CONSTRAINT fk_pu_projeto FOREIGN KEY (fk_Projeto_ID_Projeto) REFERENCES Projeto(ID_Projeto),
    CONSTRAINT fk_pu_usuario FOREIGN KEY (fk_Usuario_ID_Usuario) REFERENCES Usuario(ID_Usuario)
);

-- Atualiza a data de última atualização sempre que a demanda for editada
CREATE OR REPLACE TRIGGER TRG_atualizar_demanda
BEFORE UPDATE ON Demanda
FOR EACH ROW
BEGIN
    :NEW.Data_Atualizacao := SYSDATE;
END;
/
