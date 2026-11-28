// Autor: Lucas Paes Amaro
// Tela de Listagem: busca as demandas na API (GET /demandas) com os filtros escolhidos e monta a tabela

exigirLogin(); // sem login, volta para a tela inicial

const formFiltros = document.getElementById("formFiltros");
const corpoTabela = document.getElementById("corpoTabela");
const mensagem = document.getElementById("mensagem");

// "2026-12-02" -> "02/12/2026" (vazio vira "-")
function formatarData(data) {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return dia + "/" + mes + "/" + ano;
}

// Cria uma célula de texto (textContent evita que o texto vire HTML)
function celula(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

async function carregarDemandas() {
    // Monta a URL só com os filtros preenchidos, ex.: /demandas?status=Aberta&ordenar=prazo
    const parametros = new URLSearchParams();
    const filtros = {
        busca: document.getElementById("busca").value.trim(),
        tipo: document.getElementById("filtroTipo").value,
        prioridade: document.getElementById("filtroPrioridade").value,
        status: document.getElementById("filtroStatus").value,
        ordenar: document.getElementById("ordenar").value
    };
    for (const chave in filtros) {
        if (filtros[chave]) parametros.append(chave, filtros[chave]);
    }

    mensagem.textContent = "Carregando...";
    corpoTabela.innerHTML = "";

    const resposta = await chamarApi("/demandas?" + parametros.toString());
    if (!resposta.ok) {
        mensagem.textContent = mensagemDaApi(resposta.status, resposta.dados);
        return;
    }

    const demandas = resposta.dados;
    mensagem.textContent = demandas.length === 0 ? "Nenhuma demanda encontrada." : "";

    for (const d of demandas) {
        const linha = document.createElement("tr");

        // O título leva para a tela de detalhes da demanda
        const tdTitulo = document.createElement("td");
        const link = document.createElement("a");
        link.href = "/pages/detalhes.html?id=" + d.id;
        link.textContent = d.titulo;
        tdTitulo.appendChild(link);
        linha.appendChild(tdTitulo);

        linha.appendChild(celula(d.tipo));
        linha.appendChild(celula(d.prioridade));
        linha.appendChild(celula(d.status));
        linha.appendChild(celula(d.responsavelNome || "Sem responsável"));
        linha.appendChild(celula(formatarData(d.dataCriacao)));
        linha.appendChild(celula(formatarData(d.prazo)));

        corpoTabela.appendChild(linha);
    }
}

// Botão "Filtrar": recarrega a lista sem recarregar a página
formFiltros.addEventListener("submit", function (evento) {
    evento.preventDefault();
    carregarDemandas();
});

carregarDemandas();
