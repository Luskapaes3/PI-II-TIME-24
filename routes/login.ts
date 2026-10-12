/* Autor: [Gabriel André Cogo Fernandes]*/

import { Router, Request, Response } from "express";
import { usuarios, semSenha } from "../data/usuarios";

const router = Router();

router.post("/login", (req: Request, res: Response) => {
  const { email, senha } = req.body ?? {};

  const emailInvalido = typeof email !== "string" || email.trim() === "";
  const senhaInvalida = typeof senha !== "string" || senha === "";

  if (emailInvalido || senhaInvalida) {
    const faltando: string[] = [];
    if (emailInvalido) faltando.push("email");
    if (senhaInvalida) faltando.push("senha");

    return res.status(400).json({
      erro: "Dados inválidos.",
      mensagem: `Campo(s) obrigatório(s) ausente(s): ${faltando.join(", ")}.`
    });
  }

  const usuario = usuarios.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!usuario || usuario.senha !== senha) {
    return res.status(401).json({
      erro: "Credenciais inválidas.",
      mensagem: "E-mail ou senha incorretos."
    });
  }

  return res.status(200).json({
    mensagem: "Login realizado com sucesso.",
    usuario: semSenha(usuario)
  });
});

export default router;
