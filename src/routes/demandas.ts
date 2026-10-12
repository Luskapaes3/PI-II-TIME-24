// Autor: Matheus Misumi
import { Router, Request, Response } from "express";
import { demandas } from "../dados/dados";

const router = Router();

// GET /demandas/:id - Detalhes da Demanda
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const demanda = demandas.find(d => d.id === id);

  if (!demanda) {
    return res.status(404).json({ mensagem: "Demanda não encontrada." });
  }

  return res.status(200).json(demanda);
});

// GET /demandas/:id/comentarios - Listar comentários
router.get("/:id/comentarios", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const demanda = demandas.find(d => d.id === id);

  if (!demanda) {
    return res.status(404).json({ mensagem: "Demanda não encontrada." });
  }

  return res.status(200).json(demanda.comentarios);
});

// POST /demandas/:id/comentarios - Criar comentário
router.post("/:id/comentarios", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { usuario, texto } = req.body;
  const demanda = demandas.find(d => d.id === id);

  if (!demanda) {
    return res.status(404).json({ mensagem: "Demanda não encontrada." });
  }

  if (!texto) {
    return res.status(400).json({ mensagem: "O texto é obrigatório." });
  }

  const novoComentario = {
    id: demanda.comentarios.length + 1,
    usuario: usuario || "Anónimo",
    texto: texto,
    data: new Date().toLocaleString()
  };

  demanda.comentarios.push(novoComentario);

  return res.status(201).json({
    mensagem: "Comentário criado com sucesso!",
    comentario: novoComentario
  });
});

export default router;