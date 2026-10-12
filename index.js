"use strict";
// By-Bernardo Garcia Barbosa
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Dados temporários para testar o dashboard.
const demandas = [
    { titulo: "Erro no sistema de login", tipo: "Defeito", prioridade: "Crítica", status: "Aberta", prazo: "2026-10-14" },
    { titulo: "Falha no pagamento", tipo: "Defeito", prioridade: "Crítica", status: "Aberta", prazo: "2026-10-15" },
    { titulo: "Implementar painel de relatórios", tipo: "Tarefa", prioridade: "Alta", status: "Aberta", prazo: "2026-10-22" },
    { titulo: "Documentar endpoint da API", tipo: "Documentação", prioridade: "Média", status: "Aberta", prazo: "2026-10-30" },
    { titulo: "Melhorar busca de demandas", tipo: "Melhoria", prioridade: "Média", status: "Aberta", prazo: "2026-10-30" },
    { titulo: "Servidor indisponível", tipo: "Defeito", prioridade: "Crítica", status: "Em andamento", prazo: "2026-10-16" },
    { titulo: "Cadastro de usuários", tipo: "Tarefa", prioridade: "Alta", status: "Em andamento", prazo: "2026-10-22" },
    { titulo: "Adicionar filtro de demandas", tipo: "Melhoria", prioridade: "Alta", status: "Em andamento", prazo: "2026-10-23" },
    { titulo: "Relatório por status", tipo: "Tarefa", prioridade: "Média", status: "Em andamento", prazo: "2026-10-24" },
    { titulo: "Ajustar layout", tipo: "Tarefa", prioridade: "Baixa", status: "Em andamento", prazo: "2026-10-25" },
    { titulo: "Documentar logs do sistema", tipo: "Documentação", prioridade: "Média", status: "Em andamento", prazo: "2026-10-30" },
    { titulo: "Testar autenticação", tipo: "Defeito", prioridade: "Alta", status: "Em revisão", prazo: "2026-10-17" },
    { titulo: "Exportar relatório CSV", tipo: "Melhoria", prioridade: "Média", status: "Em revisão", prazo: "2026-10-30" },
    { titulo: "Manual de instalação", tipo: "Documentação", prioridade: "Baixa", status: "Em revisão", prazo: "2026-10-30" },
    { titulo: "Implementar autenticação", tipo: "Tarefa", prioridade: "Alta", status: "Concluída", prazo: "2026-10-01" },
    { titulo: "Criar tela inicial", tipo: "Tarefa", prioridade: "Média", status: "Concluída", prazo: "2026-10-02" },
    { titulo: "Corrigir envio de e-mail", tipo: "Defeito", prioridade: "Baixa", status: "Concluída", prazo: "2026-10-03" },
    { titulo: "Adicionar tema escuro", tipo: "Melhoria", prioridade: "Média", status: "Concluída", prazo: "2026-10-04" },
    { titulo: "Importação de dados antigos", tipo: "Tarefa", prioridade: "Alta", status: "Cancelada", prazo: "2026-10-01" },
    { titulo: "Reorganizar menu antigo", tipo: "Tarefa", prioridade: "Baixa", status: "Cancelada", prazo: "2026-10-01" }
];
app.get("/", (req, res) => {
    return res.status(200).send("API do Sistema de Acompanhamento de Demandas");
});
app.get("/dashboard", (req, res) => {
    // Calcula a quantidade de demandas por status
    const contarStatus = (status) => demandas.filter(demanda => demanda.status === status).length;
    // Calcula a quantidade de demandas por prioridade
    const contarPrioridade = (prioridade) => demandas.filter(demanda => demanda.prioridade === prioridade).length;
    // Calcula a quantidade de demandas por tipo
    const contarTipo = (tipo) => demandas.filter(demanda => demanda.tipo === tipo).length;
    // Define o período dos próximos sete dias
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const limitePrazo = new Date(hoje);
    limitePrazo.setDate(limitePrazo.getDate() + 7);
    // Considera ativas as demandas que não foram concluídas ou canceladas
    const demandasAtivas = demandas.filter(demanda => demanda.status !== "Concluída" &&
        demanda.status !== "Cancelada");
    // Lista as demandas críticas ainda não concluídas ou canceladas
    const criticasEmAberto = demandasAtivas
        .filter(demanda => demanda.prioridade === "Crítica")
        .map(demanda => ({
        titulo: demanda.titulo
    }));
    // Lista as demandas ativas com prazo nos próximos sete dias
    const demandasProximasDoPrazo = demandasAtivas
        .filter(demanda => {
        const prazo = new Date(`${demanda.prazo}T12:00:00`);
        return prazo >= hoje && prazo <= limitePrazo;
    })
        .sort((a, b) => a.prazo.localeCompare(b.prazo))
        .map(demanda => ({
        titulo: demanda.titulo,
        prazo: demanda.prazo
    }));
    // Monta os dados enviados ao frontend
    const dadosDashboard = {
        total: demandas.length,
        abertas: contarStatus("Aberta"),
        emAndamento: contarStatus("Em andamento"),
        emRevisao: contarStatus("Em revisão"),
        concluidas: contarStatus("Concluída"),
        canceladas: contarStatus("Cancelada"),
        porPrioridade: {
            critica: contarPrioridade("Crítica"),
            alta: contarPrioridade("Alta"),
            media: contarPrioridade("Média"),
            baixa: contarPrioridade("Baixa")
        },
        porTipo: {
            tarefa: contarTipo("Tarefa"),
            defeito: contarTipo("Defeito"),
            melhoria: contarTipo("Melhoria"),
            documentacao: contarTipo("Documentação")
        },
        criticasEmAberto,
        demandasProximasDoPrazo
    };
    return res.status(200).json(dadosDashboard);
});
app.listen(3000, () => {
    console.log("Servidor ativo na porta 3000");
});
//# sourceMappingURL=index.js.map