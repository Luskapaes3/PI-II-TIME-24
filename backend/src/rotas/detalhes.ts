// Autor: Matheus Yudi Misumi
import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../db";

const router = Router();

const STATUS_VALIDOS = [
  "Aberta",
  "Em andamento",
  "Em revisão",
  "Concluída",
  "Cancelada"
];

// GET /demandas/:id - Detalhes da Demanda
router.get("/demandas/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensagem: "ID de demanda inválido." });
  }

  let conn;
  try {
    conn = await getConn();

    const resultado = await conn.execute(
      `SELECT
         d.ID_DEMANDA AS "id",
         d.TITULO AS "titulo",
         d.DESCRICAO AS "descricao",
         d.TIPO AS "tipo",
         d.PRIORIDADE AS "prioridade",
         d.STATUS AS "status",
         d.DATA_CRIACAO AS "dataCriacao",
         d.DATA_ATUALIZACAO AS "dataAtualizacao",
         d.PRAZO_FINAL AS "prazoFinal",
         d.FK_PROJETO_ID_PROJETO AS "projetoId",
         p.NOME AS "projetoNome",
         d.FK_USUARIO_ID_USUARIO AS "responsavelId",
         u.NOME AS "responsavelNome"
       FROM Demanda d
       LEFT JOIN Projeto p ON p.ID_PROJETO = d.FK_PROJETO_ID_PROJETO
       LEFT JOIN Usuario u ON u.ID_USUARIO = d.FK_USUARIO_ID_USUARIO
       WHERE d.ID_DEMANDA = :id`,
      { id }
    );

    const demanda = resultado.rows?.[0];

    if (!demanda) {
      return res.status(404).json({ mensagem: "Demanda não encontrada." });
    }

    return res.status(200).json(demanda);
  } catch (erro) {
    console.error("Erro ao buscar demanda:", erro);
    return res.status(500).json({ mensagem: "Erro ao buscar demanda." });
  } finally {
    if (conn) await conn.close();
  }
});

// GET /demandas/:id/comentarios - Listar comentários
router.get("/demandas/:id/comentarios", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensagem: "ID de demanda inválido." });
  }

  let conn;
  try {
    conn = await getConn();

    const buscaDemanda = await conn.execute(
      `SELECT ID_DEMANDA AS "id" FROM Demanda WHERE ID_DEMANDA = :id`,
      { id }
    );

    if (!buscaDemanda.rows || buscaDemanda.rows.length === 0) {
      return res.status(404).json({ mensagem: "Demanda não encontrada." });
    }

    const resultado = await conn.execute(
      `SELECT
         c.ID_COMENTARIO AS "id",
         c.FK_DEMANDA_ID_DEMANDA AS "demandaId",
         c.FK_USUARIO_ID_USUARIO AS "usuarioId",
         u.NOME AS "autorNome",
         c.TEXTO AS "texto",
         c.DATA_HORA_COMENTARIO AS "dataHora"
       FROM Comentario c
       JOIN Usuario u ON u.ID_USUARIO = c.FK_USUARIO_ID_USUARIO
       WHERE c.FK_DEMANDA_ID_DEMANDA = :id
       ORDER BY c.DATA_HORA_COMENTARIO ASC, c.ID_COMENTARIO ASC`,
      { id }
    );

    return res.status(200).json(resultado.rows ?? []);
  } catch (erro) {
    console.error("Erro ao listar comentários:", erro);
    return res.status(500).json({ mensagem: "Erro ao listar comentários." });
  } finally {
    if (conn) await conn.close();
  }
});

// POST /demandas/:id/comentarios - Criar comentário
router.post("/demandas/:id/comentarios", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { texto } = req.body;
  const usuarioId = Number(req.body.usuarioId);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensagem: "ID de demanda inválido." });
  }

  if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
  return res.status(400).json({ mensagem: "Usuário não informado." });
  }

  if (!texto || !texto.trim()) {
    return res.status(400).json({ mensagem: "O texto é obrigatório." });
  }

  let conn;
  try {
    conn = await getConn();

    const resultado = await conn.execute(
      `INSERT INTO Comentario (
         TEXTO,
         FK_DEMANDA_ID_DEMANDA,
         FK_USUARIO_ID_USUARIO
       ) VALUES (
         :texto,
         :id,
         :usuarioId
       )
       RETURNING ID_COMENTARIO INTO :novoId`,
      {
        texto: texto.trim(),
        id,
        usuarioId,
        novoId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true }
    );

    const outBinds = resultado.outBinds as { novoId?: number[] } | undefined;
    const novoId = outBinds?.novoId?.[0];

    const buscaNovo = await conn.execute(
      `SELECT
         c.ID_COMENTARIO AS "id",
         c.FK_DEMANDA_ID_DEMANDA AS "demandaId",
         c.FK_USUARIO_ID_USUARIO AS "usuarioId",
         u.NOME AS "autorNome",
         c.TEXTO AS "texto",
         c.DATA_HORA_COMENTARIO AS "dataHora"
       FROM Comentario c
       JOIN Usuario u ON u.ID_USUARIO = c.FK_USUARIO_ID_USUARIO
       WHERE c.ID_COMENTARIO = :novoId`,
      { novoId }
    );

    return res.status(201).json({
      mensagem: "Comentário criado com sucesso!",
      comentario: buscaNovo.rows?.[0]
    });
  } catch (erro: unknown) {
    const oracleErr = erro as { errorNum?: number };
    if (oracleErr.errorNum === 2291) {
      return res.status(404).json({
        mensagem: "Demanda ou utilizador não encontrado no banco."
      });
    }
    console.error("Erro ao criar comentário:", erro);
    return res.status(500).json({ mensagem: "Erro ao criar comentário." });
  } finally {
    if (conn) await conn.close();
  }
});

// PATCH /demandas/:id/status - Alterar status e gravar no Histórico
router.patch("/demandas/:id/status", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const usuarioId = Number(req.body.usuarioId);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensagem: "ID de demanda inválido." });
  }

  if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
  return res.status(400).json({ mensagem: "Usuário não informado." });
  }

  if (!status || !STATUS_VALIDOS.includes(status)) {
    return res.status(400).json({
      mensagem: `Status inválido. Use: ${STATUS_VALIDOS.join(", ")}.`
    });
  }

  let conn;
  try {
    conn = await getConn();

    const busca = await conn.execute<{ status: string }>(
      `SELECT STATUS AS "status" FROM Demanda WHERE ID_DEMANDA = :id`,
      { id }
    );

    const atual = busca.rows?.[0];
    if (!atual) {
      return res.status(404).json({ mensagem: "Demanda não encontrada." });
    }

    if (atual.status === status) {
      return res.status(400).json({
        mensagem: `A demanda já está com o status "${status}".`
      });
    }

    if (atual.status === "Concluída" || atual.status === "Cancelada") {
      return res.status(400).json({
        mensagem: `Não é possível alterar uma demanda que já está "${atual.status}".`
      });
    }

    await conn.execute(
      `UPDATE Demanda SET STATUS = :status WHERE ID_DEMANDA = :id`,
      { status, id }
    );

    await conn.execute(
      `INSERT INTO Historico (
         DESCRICAO,
         CAMPO_ALTERADO,
         VALOR_ANTERIOR,
         VALOR_NOVO,
         FK_DEMANDA_ID_DEMANDA,
         FK_USUARIO_ID_USUARIO
       ) VALUES (
         :descricao,
         'Status',
         :valorAnterior,
         :valorNovo,
         :id,
         :usuarioId
       )`,
      {
        descricao: `Status alterado de "${atual.status}" para "${status}".`,
        valorAnterior: atual.status,
        valorNovo: status,
        id,
        usuarioId
      }
    );

    await conn.commit();

    return res.status(200).json({
      mensagem: "Status atualizado com sucesso!",
      statusAnterior: atual.status,
      statusNovo: status
    });
  } catch (erro: unknown) {
    if (conn) {
      try {
        await conn.rollback();
      } catch {}
    }
    const oracleErr = erro as { errorNum?: number };
    if (oracleErr.errorNum === 2291) {
      return res.status(404).json({
        mensagem: "Utilizador não encontrado no banco."
      });
    }
    console.error("Erro ao atualizar status:", erro);
    return res.status(500).json({ mensagem: "Erro ao atualizar status." });
  } finally {
    if (conn) await conn.close();
  }
});

// GET /demandas/:id/historico - Listar histórico de alterações da demanda
router.get("/demandas/:id/historico", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ mensagem: "ID de demanda inválido." });
  }

  let conn;
  try {
    conn = await getConn();

    const resultado = await conn.execute(
      `SELECT
         h.ID_HISTORICO AS "id",
         h.DESCRICAO AS "descricao",
         h.CAMPO_ALTERADO AS "campoAlterado",
         h.VALOR_ANTERIOR AS "valorAnterior",
         h.VALOR_NOVO AS "valorNovo",
         h.DATA_HORA_HISTORICO AS "dataHora",
         h.FK_USUARIO_ID_USUARIO AS "usuarioId",
         u.NOME AS "usuarioNome"
       FROM Historico h
       JOIN Usuario u ON u.ID_USUARIO = h.FK_USUARIO_ID_USUARIO
       WHERE h.FK_DEMANDA_ID_DEMANDA = :id
       ORDER BY h.DATA_HORA_HISTORICO DESC, h.ID_HISTORICO DESC`,
      { id }
    );

    return res.status(200).json(resultado.rows ?? []);
  } catch (erro) {
    console.error("Erro ao listar histórico:", erro);
    return res.status(500).json({ mensagem: "Erro ao listar histórico." });
  } finally {
    if (conn) await conn.close();
  }
});

export default router;