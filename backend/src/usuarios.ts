/* Autor: Gabriel André Cogo Fernandes*/

import { Router, Request, Response } from "express";
import { getConn } from "./db";

const router = Router();

router.get("/usuarios", async (_req: Request, res: Response) => {
  let conn;
  try{
    conn = await getConn();
    const result = await conn.execute(
      `SELECT id AS "id", nome AS "nome", email AS "email", perfil AS "perfil" FROM usuarios`
    );
    return res.status(200).json(result.rows);
  } 
  catch(erro){
    console.error(erro);
    return res.status(500).json({ erro: "Erro ao buscar usuários." });
  }
  finally {
    if (conn) await conn.close();
  }
});

export default router;