// Autor: Gabriel André Cogo Fernandes

import { Router } from "express";
import { usuarios, semSenha } from "../data/usuarios";

const router = Router();

router.post("/login", (req, res) => {
    let { email, senha } = req.body;

    if (typeof email !== "string" || email.trim() === "" || typeof senha !== "string" || senha === "") {
        return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios." });
    }

    email = email.trim();

    // Procura o usuário no array que você tem
    const usuarioEncontrado = usuarios.find(
        (u) => u.email === email && u.senha === senha
    );

    if (!usuarioEncontrado) {
        return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
    }

    // Retorna o usuário logado sem a senha (usando a função que você criou)
    return res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        usuario: semSenha(usuarioEncontrado)
    });
});

export default router;
