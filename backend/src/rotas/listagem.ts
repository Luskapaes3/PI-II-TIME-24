// Autor: Lucas Paes Amaro
// Rota GET /demandas: lista as demandas do Oracle com filtros, busca e ordenação
import { Router, Request, Response } from "express";
import { getConn } from "../db";
import { STATUS, PRIORIDADES, TIPOS } from "../tipos";

const router = Router();

// Ordenações aceitas (o valor vai direto no SQL, por isso só aceitamos estas)
const ORDENACOES: Record<string, string> = {
  prioridade: `CASE d.Prioridade WHEN 'Crítica' THEN 1 WHEN 'Alta' THEN 2 WHEN 'Média' THEN 3 ELSE 4 END`,
  status: `CASE d.Status WHEN 'Aberta' THEN 1 WHEN 'Em andamento' THEN 2 WHEN 'Em revisão' THEN 3 WHEN 'Concluída' THEN 4 ELSE 5 END`,
  dataCriacao: `d.Data_Criacao`,
  prazo: `d.Prazo_Final NULLS LAST`
};

router.get("/demandas", async (req: Request, res: Response) => {
  const status = req.query.status ? String(req.query.status) : "";
  const prioridade = req.query.prioridade ? String(req.query.prioridade) : "";
  const tipo = req.query.tipo ? String(req.query.tipo) : "";
  const busca = req.query.busca ? String(req.query.busca).trim() : "";
  const ordenar = req.query.ordenar ? String(req.query.ordenar) : "";

  // Erro 400 se algum filtro vier com valor que não existe
  if (status && !STATUS.includes(status as any)) {
    return res.status(400).json({ mensagem: "Status inválido." });
  }
  if (prioridade && !PRIORIDADES.includes(prioridade as any)) {
    return res.status(400).json({ mensagem: "Prioridade inválida." });
  }
  if (tipo && !TIPOS.includes(tipo as any)) {
    return res.status(400).json({ mensagem: "Tipo inválido." });
  }
  if (ordenar && !ORDENACOES[ordenar]) {
    return res.status(400).json({ mensagem: "Ordenação inválida." });
  }

  // Monta o WHERE só com os filtros que vieram (valores sempre por :bind)
  const condicoes: string[] = [];
  const valores: Record<string, string> = {};
  if (status) { condicoes.push("d.Status = :status"); valores.status = status; }
  if (prioridade) { condicoes.push("d.Prioridade = :prioridade"); valores.prioridade = prioridade; }
  if (tipo) { condicoes.push("d.Tipo = :tipo"); valores.tipo = tipo; }
  if (busca) {
    // busca no título ou na descrição, sem diferenciar maiúscula de minúscula
    condicoes.push("(LOWER(d.Titulo) LIKE :busca OR LOWER(d.Descricao) LIKE :busca)");
    valores.busca = "%" + busca.toLowerCase() + "%";
  }
  const where = condicoes.length > 0 ? "WHERE " + condicoes.join(" AND ") : "";
  const ordem = ordenar ? ORDENACOES[ordenar] + ", d.ID_Demanda" : "d.ID_Demanda";

  let conn;
  try {
    conn = await getConn();
    const resultado = await conn.execute(
      `SELECT
         d.ID_Demanda AS "id",
         d.Titulo AS "titulo",
         d.Descricao AS "descricao",
         d.Tipo AS "tipo",
         d.Prioridade AS "prioridade",
         d.Status AS "status",
         d.fk_Projeto_ID_Projeto AS "projetoId",
         p.Nome AS "projetoNome",
         d.fk_Usuario_ID_Usuario AS "responsavelId",
         u.Nome AS "responsavelNome",
         TO_CHAR(d.Data_Criacao, 'YYYY-MM-DD') AS "dataCriacao",
         TO_CHAR(d.Data_Atualizacao, 'YYYY-MM-DD') AS "dataAtualizacao",
         TO_CHAR(d.Prazo_Final, 'YYYY-MM-DD') AS "prazo"
       FROM Demanda d
       LEFT JOIN Projeto p ON p.ID_Projeto = d.fk_Projeto_ID_Projeto
       LEFT JOIN Usuario u ON u.ID_Usuario = d.fk_Usuario_ID_Usuario
       ${where}
       ORDER BY ${ordem}`,
      valores
    );
    return res.status(200).json(resultado.rows ?? []);
  } catch (erro) {
    console.error("Erro ao listar demandas:", erro);
    return res.status(500).json({ mensagem: "Erro ao listar demandas." });
  } finally {
    if (conn) await conn.close();
  }
});

export default router;
