// Autor: Lucas Paes Amaro
// Ponto de entrada do servidor
import express from "express";
import rotasDemandas from "./rotas/demandas";

const app = express();
const PORTA = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "Servidor funcionando!" });
});

app.use("/demandas", rotasDemandas);

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});