/* Autor: Gabriel André Cogo Fernandes*/

const URL_API = "";

// Tela de login: para onde mandamos quem não está autenticado
const PAGINA_LOGIN = "/";

// Nomes com que a sessão fica guardada no navegador (localStorage)
const CHAVE_TOKEN = "pi2_token";
const CHAVE_USUARIO = "pi2_usuario";

// ---------- Sessão do usuário ----------

// Guarda a sessão depois de um login bem-sucedido.
// O token pode não existir (se a API só devolver os dados do usuário).
function salvarSessao(token, usuario){
    if (token){
        localStorage.setItem(CHAVE_TOKEN, token);
    } else {
        localStorage.removeItem(CHAVE_TOKEN);
    }
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

// Devolve o token guardado (ou null)
function obterToken(){
    return localStorage.getItem(CHAVE_TOKEN);
}

// Devolve os dados do usuário logado (ou null se não houver ninguém logado)
function obterUsuario(){
    const texto = localStorage.getItem(CHAVE_USUARIO);
    if (!texto){
        return null;
    }
    try {
        return JSON.parse(texto);
    } catch (erro){
        // Conteúdo estragado: trata como se não houvesse sessão
        return null;
    }
}

// true se existe alguém logado
function estaLogado(){
    return obterUsuario() !== null;
}

// Coloque no começo de toda tela protegida: sem login, volta para o index
function exigirLogin(){
    if (!estaLogado()){
        window.location.replace(PAGINA_LOGIN);
    }
}

// Encerra a sessão (botão "Sair")
function sair(){
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
    window.location.replace(PAGINA_LOGIN);
}

// ---------- Conversa com a API ----------

// Escolhe a mensagem de erro que será mostrada na tela
function mensagemDaApi(status, dados){
    // 1) Se a API mandou um texto de erro, usa o texto dela
    const textoApi = dados.mensagem || dados.erro || dados.message || dados.error;
    if (typeof textoApi === "string" && textoApi !== ""){
        return textoApi;
    }

    // 2) Se não mandou, usa um texto padrão para cada código
    if (status === 400) return "Dados inválidos. Confira o que foi preenchido e tente de novo.";
    if (status === 401) return "Acesso não autorizado. Confira e-mail e senha ou entre novamente.";
    if (status === 403) return "Seu perfil não tem permissão para esta ação.";
    if (status === 404) return "Registro não encontrado.";
    return "Erro no servidor (código " + status + "). Tente de novo em instantes.";
}

// Faz uma chamada à API já enviando o token (se houver).
// Devolve sempre { ok, status, dados } e NUNCA lança erro:
//   ok     -> true quando o status é 200-299
//   status -> código HTTP (0 quando não foi possível falar com a API)
//   dados  -> o JSON da resposta (objeto vazio se não vier JSON)
// Exemplo: const r = await chamarApi("/demandas");
async function chamarApi(caminho, opcoes = {}){
    const cabecalhos = { ...opcoes.headers };

    // Só avisa que o corpo é JSON quando existe corpo (POST/PUT)
    if (opcoes.body){
        cabecalhos["Content-Type"] = "application/json";
    }

    // Se houver sessão com token, ele vai junto em todas as chamadas
    const token = obterToken();
    if (token){
        cabecalhos["Authorization"] = "Bearer " + token;
    }

    let resposta;
    try {
        resposta = await fetch(URL_API + caminho, { ...opcoes, headers: cabecalhos });
    } catch (erro){
        // O fetch só falha assim quando a API está fora do ar (ou o CORS bloqueou)
        return {
            ok: false,
            status: 0,
            dados: { mensagem: "Não foi possível conectar à API. Confira se o servidor está ligado." }
        };
    }

    // Lê o JSON da resposta (se não vier JSON, usa um objeto vazio)
    let dados = {};
    try {
        dados = (await resposta.json()) || {};
    } catch (erro){
        dados = {};
    }

    // 401 em qualquer rota (menos no /login) = sessão inválida ou vencida
    if (resposta.status === 401 && caminho !== "/login"){
        sair();
    }

    return { ok: resposta.ok, status: resposta.status, dados: dados };
}
 