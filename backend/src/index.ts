 //Autor: Henrique

import "dotenv/config"; // le o arquivo .env pra pegar a porta
import express from "express"; //transforma e em objeto (????)
import path from "path";

// Rotas de cada integrante (cada um tira o // da sua linha quando trouxer o arquivo)
// import rotasLogin from "./rotas/login";          // Gabriel
// import rotasUsuarios from "./rotas/usuarios";    // Gabriel
// import rotasDashboard from "./rotas/dashboard";  // Bernardo
// import rotasListagem from "./rotas/listagem";    // Lucas
 import rotasCadastro from "./rotas/cadastro";    // Henrique
// import rotasDetalhes from "./rotas/detalhes";    // Matheus

const app = express();
const PORT = Number(process.env.PORT ?? 3000); // porta vem do .env (ou 3000)

// permite ler o JSON que as telas mandam no POST e no PUT
app.use(express.json());

// rota de teste para ver se o servidor está no ar
app.get("/status", (req, res) => {
  res.json({ mensagem: "Servidor funcionando!" });
});

// rotas da API (cada um tira o // da sua linha)
// app.use(rotasLogin);
// app.use(rotasUsuarios);
// app.use(rotasDashboard);
// app.use(rotasListagem);
 app.use(rotasCadastro);
// app.use(rotasDetalhes);

// mostra as telas da pasta frontend: "/" abre o login, as outras ficam em /pages
app.use(express.static(path.join(__dirname, "../../frontend")));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});