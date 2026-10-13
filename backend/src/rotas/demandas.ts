// Autor: Lucas Paes
// Rota GET /demandas com filtros, busca e ordenação
import { Router } from "express";
import { demandas } from "../dados";

const router = Router();
const ordemPrioridade = ["Crítica", "Alta", "Média", "Baixa"];
const ordemStatus = ["Aberta", "Em andamento", "Em revisão", "Concluída", "Cancelada"];

router.get("/", (req, res) => {
  const { status, prioridade, tipo, busca, ordenar } = req.query;

  // Erro 400 se o status for inválido
  if (status && !ordemStatus.includes(String(status))) {
    return res.status(400).json({ erro: "Status inválido." });
  }

  let lista = [...demandas];

  // Filtros
  if (status) lista = lista.filter((d) => d.status === status);
  if (prioridade) lista = lista.filter((d) => d.prioridade === prioridade);
  if (tipo) lista = lista.filter((d) => d.tipo === tipo);

  // Busca por título ou descrição
  if (busca) {
    const termo = String(busca).toLowerCase();
    lista = lista.filter((d) => d.titulo.toLowerCase().includes(termo) || d.descricao.toLowerCase().includes(termo));
  }

  // Ordenação
  if (ordenar === "prioridade") lista.sort((a, b) => ordemPrioridade.indexOf(a.prioridade) - ordemPrioridade.indexOf(b.prioridade));
  if (ordenar === "status") lista.sort((a, b) => ordemStatus.indexOf(a.status) - ordemStatus.indexOf(b.status));
  if (ordenar === "dataCriacao") lista.sort((a, b) => a.dataCriacao.localeCompare(b.dataCriacao));
  if (ordenar === "prazo") lista.sort((a, b) => (a.prazo ?? "9999").localeCompare(b.prazo ?? "9999"));

  res.status(200).json(lista);
});

export default router;