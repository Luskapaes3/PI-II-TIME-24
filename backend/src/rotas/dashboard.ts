// Autor: Bernardo Garcia Barbosa
// Rota que busca as informações do dashboard no Oracle

import { Router } from "express";
import oracledb from "oracledb";
import { getConn } from "../db";

const router = Router();

router.get("/dashboard", async (req, res) => {

    let conexao: oracledb.Connection | undefined;

    try {

        // Abre a conexão com o banco
        conexao = await getConn();

        // Conta as demandas de cada status
        const status = await conexao.execute<any>(`
            SELECT
                COUNT(*) AS "total",
                COUNT(CASE WHEN Status = 'Aberta'
                    THEN 1 END) AS "abertas",
                COUNT(CASE WHEN Status = 'Em andamento'
                    THEN 1 END) AS "emAndamento",
                COUNT(CASE WHEN Status = 'Em revisão'
                    THEN 1 END) AS "emRevisao",
                COUNT(CASE WHEN Status = 'Concluída'
                    THEN 1 END) AS "concluidas",
                COUNT(CASE WHEN Status = 'Cancelada'
                    THEN 1 END) AS "canceladas"
            FROM Demanda
        `, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        // Conta as demandas de cada prioridade
        const prioridade = await conexao.execute<any>(`
            SELECT
                COUNT(CASE WHEN Prioridade = 'Crítica'
                    THEN 1 END) AS "critica",
                COUNT(CASE WHEN Prioridade = 'Alta'
                    THEN 1 END) AS "alta",
                COUNT(CASE WHEN Prioridade = 'Média'
                    THEN 1 END) AS "media",
                COUNT(CASE WHEN Prioridade = 'Baixa'
                    THEN 1 END) AS "baixa"
            FROM Demanda
        `, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        // Conta as demandas de cada tipo
        const tipo = await conexao.execute<any>(`
            SELECT
                COUNT(CASE WHEN Tipo = 'Tarefa'
                    THEN 1 END) AS "tarefa",
                COUNT(CASE WHEN Tipo = 'Defeito'
                    THEN 1 END) AS "defeito",
                COUNT(CASE WHEN Tipo = 'Melhoria'
                    THEN 1 END) AS "melhoria",
                COUNT(CASE WHEN Tipo = 'Documentação'
                    THEN 1 END) AS "documentacao"
            FROM Demanda
        `, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        // Busca as demandas críticas que ainda estão ativas
        const criticas = await conexao.execute(`
            SELECT
                ID_Demanda AS "id",
                Titulo AS "titulo"
            FROM Demanda
            WHERE Prioridade = 'Crítica'
            AND Status NOT IN ('Concluída', 'Cancelada')
        `, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        // Busca as demandas que vencem nos próximos 7 dias
        const prazos = await conexao.execute(`
            SELECT
                ID_Demanda AS "id",
                Titulo AS "titulo",
                TO_CHAR(Prazo_Final, 'YYYY-MM-DD') AS "prazo"
            FROM Demanda
            WHERE TRUNC(Prazo_Final)
                BETWEEN TRUNC(SYSDATE)
                AND TRUNC(SYSDATE) + 7
            AND Status NOT IN ('Concluída', 'Cancelada')
            ORDER BY Prazo_Final
        `, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        // Envia todas as informações para o HTML
        return res.status(200).json({
            ...status.rows![0],
            porPrioridade: prioridade.rows![0],
            porTipo: tipo.rows![0],
            criticasEmAberto: criticas.rows,
            demandasProximasDoPrazo: prazos.rows
        });

    } catch (erro) {

        // Mostra o erro caso não consiga buscar os dados
        console.error("Erro no Dashboard:", erro);

        return res.status(500).json({
            erro: "Erro ao carregar as demandas."
        });

    } finally {

        // Fecha a conexão com o banco
        if (conexao) {
            try {
                await conexao.close();
            } catch (erro) {
                console.error("Erro ao fechar conexão:", erro);
            }
        }
    }
});

// Permite usar a rota no servidor principal
export default router;
