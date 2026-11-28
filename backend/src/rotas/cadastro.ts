/*
 * Autor: Henrique Kenji Tutiya
 * Projeto Integrador II
 * Rotas: POST /demandas e GET /projetos
 */

import { Router } from "express";
import { demandas, projetos } from "../dados/demandas";
import {TIPOS,PRIORIDADES} from "../tipos";

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

  // Validar título
if (
  typeof titulo !== "string" ||
  titulo.trim().length < 5 ||
  titulo.trim().length > 100
) {
  return res.status(400).json({
    erro: "Título inválido."
  });
}

// Validar descrição
if (
  typeof descricao !== "string" ||
  descricao.trim().length < 10 ||
  descricao.trim().length > 500
) {
  return res.status(400).json({
    erro: "Descrição inválida."
  });
}

// Validar tipo
if (!TIPOS.includes(tipo)) {
  return res.status(400).json({
    erro: "Tipo inválido."
  });
}

// Validar prioridade
if (!PRIORIDADES.includes(prioridade)) {
  return res.status(400).json({
    erro: "Prioridade inválida."
  });
}

// Validar projeto
if (!projetos.some(p => p.id === Number(projetoId))) {
  return res.status(400).json({
    erro: "Projeto inválido."
  });
}

  const agora = new Date().toISOString();

  const novaDemanda = {
    id:
      demandas.length > 0
        ? Math.max(...demandas.map((d) => Number(d.id))) + 1
        : 1,
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    tipo,
    prioridade,
    status: "Aberta",
    projetoId: Number(projetoId),
    responsavelId: responsavelId || null,
    dataCriacao: agora,
    dataAtualizacao: agora,
    prazo: prazo || null
  };

  demandas.push(novaDemanda);

  return res.status(201).json(novaDemanda);
});

export default router;

