
import express from "express";
import itensRouter from "./rotas/itens";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    mensagem: "API funcionando!"
  });
});

app.use(itensRouter);

app.listen(PORT, () => {
  console.log(`Servidor funcionando em http://localhost:${PORT}`);
});

