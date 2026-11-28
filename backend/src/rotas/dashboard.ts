// Autor: Bernardo Garcia Barbosa
// Rota que retorna as informações do dashboard

import { Router } from "express";
import { demandas } from "../dados/demandas";
import { StatusDemanda, PrioridadeDemanda, TipoDemanda } from "../tipos";

const router = Router();

router.get("/dashboard", (req, res) => {

    // Conta quantas demandas possuem o status recebido
    const contarStatus = (status: StatusDemanda) =>
        demandas.filter(demanda => demanda.status === status).length;

    // Conta as demandas de cada prioridade
    const contarPrioridade = (prioridade: PrioridadeDemanda) =>
        demandas.filter(demanda => demanda.prioridade === prioridade).length;

    // Conta as demandas de cada tipo
    const contarTipo = (tipo: TipoDemanda) =>
        demandas.filter(demanda => demanda.tipo === tipo).length;

    // Pega a data de hoje sem considerar o horario
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Soma 7 dias para verificar os prazos mais proximos
    const limitePrazo = new Date(hoje);
    limitePrazo.setDate(limitePrazo.getDate() + 7);
    limitePrazo.setHours(23, 59, 59, 999);

    // Retira as demandas que ja foram concluidas ou canceladas
    const demandasAtivas = demandas.filter(
        demanda =>
            demanda.status !== "Concluída" &&
            demanda.status !== "Cancelada"
    );

    // Pega apenas as demandas criticas que continuam ativas
    const criticasEmAberto = demandasAtivas
        .filter(demanda => demanda.prioridade === "Crítica")
        .map(demanda => ({
            titulo: demanda.titulo
        }));

    // Verifica quais demandas possuem prazo nos proximos 7 dias
    const demandasProximasDoPrazo = demandasAtivas
        .filter(demanda => {

            // Algumas demandas podem não ter prazo
            if (!demanda.prazo) {
                return false;
            }

            const prazo = new Date(`${demanda.prazo}T12:00:00`);

            return prazo >= hoje && prazo <= limitePrazo;
        })

        // Ordena as demandas pelo prazo
        .sort((a, b) => (a.prazo ?? "").localeCompare(b.prazo ?? ""))

        // Pega somente as informações que serão usadas na tela
        .map(demanda => ({
            titulo: demanda.titulo,
            prazo: demanda.prazo
        }));

    // Junta todas as informações que o HTML precisa receber
    const dadosDashboard = {

        total: demandas.length,

        abertas: contarStatus("Aberta"),
        emAndamento: contarStatus("Em andamento"),
        emRevisao: contarStatus("Em revisão"),
        concluidas: contarStatus("Concluída"),
        canceladas: contarStatus("Cancelada"),

        // Quantidade por prioridade
        porPrioridade: {
            critica: contarPrioridade("Crítica"),
            alta: contarPrioridade("Alta"),
            media: contarPrioridade("Média"),
            baixa: contarPrioridade("Baixa")
        },

        // Quantidade por tipo
        porTipo: {
            tarefa: contarTipo("Tarefa"),
            defeito: contarTipo("Defeito"),
            melhoria: contarTipo("Melhoria"),
            documentacao: contarTipo("Documentação")
        },

        criticasEmAberto,
        demandasProximasDoPrazo
    };

    // Envia os dados em JSON para o frontend
    return res.status(200).json(dadosDashboard);
});

// Permite usar essa rota no servidor principal
export default router;
