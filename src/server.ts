// Autor: Matheus Misumi
import express, { Request, Response } from "express";
import demandasRoutes from "./routes/demandas";

const app = express();

app.use(express.json());

// Rota de teste
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ mensagem: "Servidor a funcionar!" });
});

// Usar as rotas
app.use("/demandas", demandasRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});