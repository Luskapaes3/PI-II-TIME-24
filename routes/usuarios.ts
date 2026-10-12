/* Autor: [Gabriel André Cogo Fernandes]*/

import { Router, Request, Response } from "express";
import { usuarios, semSenha } from "../data/usuarios";

const router = Router();

router.get("/usuarios", (_req: Request, res: Response) => {
  res.status(200).json(usuarios.map(semSenha));
});

export default router;
