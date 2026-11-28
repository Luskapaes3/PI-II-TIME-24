/* Autor: [Gabriel André Cogo Fernandes]*/

import express, { Request, Response, NextFunction } from "express";

import loginRoutes from "./routes/login";
import usuariosRoutes from "./routes/usuarios";

const app = express();
const PORTA = 3000;

app.use(express.json());

app.use(loginRoutes);      
app.use(usuariosRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      erro: "Dados inválidos.",
      mensagem: "O corpo da requisição não é um JSON válido."
    });
  }
  console.error(err);
  return res.status(500).json({ erro: "Erro interno do servidor." });
});

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
