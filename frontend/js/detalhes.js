// Autor: Matheus Yudi Misumi
// Módulo: Detalhes da Demanda e Comentários

function escaparHtml(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, function(caractere) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[caractere];
    });
}

function obterDemandaId() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = Number(urlParams.get("id"));
    return Number.isInteger(id) && id > 0 ? id : 1;
}

window.addEventListener("DOMContentLoaded", function() {
    const demandaId = obterDemandaId();
    carregarDetalhes(demandaId);
    carregarComentarios(demandaId);
});

function carregarDetalhes(id) {
    fetch("/demandas/" + id)
        .then(function(resposta) {
            if (!resposta.ok) {
                return resposta.json().then(function(err) {
                    throw new Error(err.mensagem || "Erro ao buscar demanda");
                });
            }
            return resposta.json();
        })
        .then(function(dados) {
            document.getElementById("titulo-demanda").innerText = dados.titulo ?? "";
            document.getElementById("descricao-demanda").innerText = dados.descricao ?? "";
            document.getElementById("status-demanda").innerText = dados.status ?? "";
        })
        .catch(function(erro) {
            console.error("Erro ao carregar detalhes:", erro);
            const erroBox = document.getElementById("erro-box");
            erroBox.innerText = erro.message;
            erroBox.style.display = "block";
        });
}

function carregarComentarios(id) {
    fetch("/demandas/" + id + "/comentarios")
        .then(function(resposta) {
            if (!resposta.ok) {
                return resposta.json().then(function(err) {
                    throw new Error(err.mensagem || "Erro ao carregar comentários");
                });
            }
            return resposta.json();
        })
        .then(function(comentarios) {
            const lista = document.getElementById("lista-comentarios");
            lista.innerHTML = "";

            for (let i = 0; i < comentarios.length; i++) {
                const autor = comentarios[i].autorNome || ("Utilizador #" + comentarios[i].usuarioId);
                const item = document.createElement("li");
                item.innerHTML = "<strong>" + escaparHtml(autor) + ":</strong> " + escaparHtml(comentarios[i].texto);
                lista.appendChild(item);
            }
        })
        .catch(function(erro) {
            console.error("Erro ao carregar comentários:", erro);
        });
}

const botaoEnviar = document.getElementById("btn-enviar-comentario");
if (botaoEnviar) {
    botaoEnviar.addEventListener("click", function() {
        const inputComentario = document.getElementById("input-comentario");
        const textoInput = inputComentario.value;
        const demandaId = obterDemandaId();

        if (!textoInput.trim()) {
            alert("O texto não pode ser vazio!");
            return;
        }

        const dadosEnvio = {
            usuarioId: obterUsuario()?.id,
            texto: textoInput.trim()
        };

        fetch("/demandas/" + demandaId + "/comentarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosEnvio)
        })
        .then(function(resposta) {
            return resposta.json().then(function(resultado) {
                if (!resposta.ok) {
                    throw new Error(resultado.mensagem || "Erro ao enviar comentário");
                }
                return resultado;
            });
        })
        .then(function() {
            inputComentario.value = "";
            carregarComentarios(demandaId);
        })
        .catch(function(erro) {
            const erroBox = document.getElementById("erro-box");
            erroBox.innerText = erro.message;
            erroBox.style.display = "block";
        });
    });
}