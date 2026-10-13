/*
 * Autor: Henrique Kenji Tutiya
 * Projeto Integrador II
 * Rotas: POST /demandas e GET /projetos
 */

import { Router } from "express";
import { demandas, projetos } from "../dados";

const router = Router();

// GET /projetos
// Lista os projetos cadastrados nos dados de teste.
router.get("/projetos", (_req, res) => {
  return res.status(200).json(projetos);
});

// POST /demandas
// Cadastra uma nova demanda.
router.post("/demandas", (req, res) => {
  const {
    titulo,
    descricao,
    tipo,
    prioridade,
    projetoId,
    responsavelId,
    prazo
  } = req.body;

  const agora = new Date().toISOString();

  const novaDemanda = {
    id:
      demandas.length > 0
        ? Math.max(...demandas.map((d) => Number(d.id))) + 1
        : 1,
    titulo,
    descricao,
    tipo,
    prioridade,
    status: "Aberta",
    projetoId,
    responsavelId: responsavelId || null,
    dataCriacao: agora,
    dataAtualizacao: agora,
    prazo: prazo || null
  };

  demandas.push(novaDemanda);

  return res.status(201).json(novaDemanda);
});

export default router;

