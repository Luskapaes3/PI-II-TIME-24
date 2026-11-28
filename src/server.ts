import express from "express";
import cors from "cors";
import "dotenv/config";
import { initPool, closePool } from "./db";
import demandasRouter from "./routes/detalhes";

const app = express();
app.use(express.json());
app.use(cors());

// As tuas rotas
app.use(demandasRouter);

const PORT = Number(process.env.PORT ?? 3000);

async function iniciarServidor() {
  try {
    await initPool();
    app.listen(PORT, () => {
      console.log(`Servidor ativo na porta ${PORT}`);
    });
    process.on("SIGINT", async () => { await closePool(); process.exit(0); });
    process.on("SIGTERM", async () => { await closePool(); process.exit(0); });
  } catch (erro) {
    console.error("Falha ao iniciar o servidor:", erro);
    process.exit(1);
  }
}

iniciarServidor();