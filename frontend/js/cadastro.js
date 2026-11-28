//Autor: Henrique Kenji Tutiya
const form = document.getElementById("formDemanda");

const titulo = document.getElementById("titulo");
const descricao = document.getElementById("descricao");
const tipo = document.getElementById("tipo");
const prioridade = document.getElementById("prioridade");
const projeto = document.getElementById("projeto");
const dataLimite = document.getElementById("dataLimite");

const painelResultado = document.getElementById("painelResultado");
const resultado = document.getElementById("resultado");
const btnCancelar = document.getElementById("btnCancelar");


// ===============================
// FUNÇÕES AUXILIARES
// ===============================

function mostrarErro(idErro, mensagem, campoElemento = null) {
    const elementoErro = document.getElementById(idErro);
    elementoErro.textContent = mensagem;

    if (campoElemento) {
        campoElemento.classList.toggle("campo-invalido", Boolean(mensagem));
    }
}

function limparErros() {
    document.querySelectorAll(".erro").forEach(function (erro) {
        erro.textContent = "";
    });

    document.querySelectorAll(".campo-invalido").forEach(function (campo) {
        campo.classList.remove("campo-invalido");
    });
}


// ===============================
// CARREGAMENTO DE PROJETOS (GET /projetos)
// ===============================

async function carregarProjetos() {
    try {
        const resposta = await fetch("/projetos");
        if (!resposta.ok) {
            return;
        }

        const dados = await resposta.json().catch(function () {
            return null;
        });

        const listaProjetos = Array.isArray(dados)
            ? dados
            : Array.isArray(dados?.projetos)
                ? dados.projetos
                : null;

        if (!listaProjetos || listaProjetos.length === 0) {
            return;
        }

        const valorAnterior = projeto.value;
        projeto.innerHTML = '<option value="">Selecione</option>';

        listaProjetos.forEach(function (item) {
            if (item && item.id !== undefined && item.nome) {
                const option = document.createElement("option");
                option.value = String(item.id);
                option.textContent = item.nome;
                projeto.appendChild(option);
            }
        });

        if (valorAnterior) {
            projeto.value = valorAnterior;
        }
    } catch (erro) {
        console.warn("Não foi possível carregar projetos de /projetos:", erro);
    }
}


// ===============================
// VALIDAÇÃO DO TÍTULO
// ===============================

function validarTitulo() {
    const valor = titulo.value.trim();

    if (valor === "") {
        mostrarErro("erroTitulo", "O título é obrigatório.", titulo);
        return false;
    }

    if (valor.length < 5) {
        mostrarErro("erroTitulo", "O título deve ter pelo menos 5 caracteres.", titulo);
        return false;
    }

    if (valor.length > 100) {
        mostrarErro("erroTitulo", "O título deve ter no máximo 100 caracteres.", titulo);
        return false;
    }

    mostrarErro("erroTitulo", "", titulo);
    return true;
}


// ===============================
// VALIDAÇÃO DA DESCRIÇÃO
// ===============================

function validarDescricao() {
    const valor = descricao.value.trim();

    if (valor === "") {
        mostrarErro("erroDescricao", "A descrição é obrigatória.", descricao);
        return false;
    }

    if (valor.length < 10) {
        mostrarErro(
            "erroDescricao",
            "A descrição deve ter pelo menos 10 caracteres.",
            descricao
        );
        return false;
    }

    if (valor.length > 500) {
        mostrarErro(
            "erroDescricao",
            "A descrição deve ter no máximo 500 caracteres.",
            descricao
        );
        return false;
    }

    mostrarErro("erroDescricao", "", descricao);
    return true;
}


// ===============================
// VALIDAÇÃO DOS SELECTS
// ===============================

function validarTipo() {
    if (tipo.value === "") {
        mostrarErro("erroTipo", "Selecione o tipo da demanda.", tipo);
        return false;
    }

    mostrarErro("erroTipo", "", tipo);
    return true;
}

function validarPrioridade() {
    if (prioridade.value === "") {
        mostrarErro("erroPrioridade", "Selecione a prioridade.", prioridade);
        return false;
    }

    mostrarErro("erroPrioridade", "", prioridade);
    return true;
}

function validarProjeto() {
    if (projeto.value === "") {
        mostrarErro("erroProjeto", "Selecione um projeto.", projeto);
        return false;
    }

    mostrarErro("erroProjeto", "", projeto);
    return true;
}


// ===============================
// VALIDAÇÃO DA DATA
// ===============================

function validarData() {
    const valor = dataLimite.value;

    if (valor === "") {
        mostrarErro("erroData", "A data limite é obrigatória.", dataLimite);
        return false;
    }

    // Obtém a data atual no formato YYYY-MM-DD
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    const dataAtual = `${ano}-${mes}-${dia}`;

    if (valor < dataAtual) {
        mostrarErro(
            "erroData",
            "A data limite não pode ser anterior à data atual.",
            dataLimite
        );
        return false;
    }

    mostrarErro("erroData", "", dataLimite);
    return true;
}


// ===============================
// VALIDAÇÃO COMPLETA
// ===============================

function validarFormulario() {
    const tituloValido = validarTitulo();
    const descricaoValida = validarDescricao();
    const tipoValido = validarTipo();
    const prioridadeValida = validarPrioridade();
    const projetoValido = validarProjeto();
    const dataValida = validarData();

    return (
        tituloValido &&
        descricaoValida &&
        tipoValido &&
        prioridadeValida &&
        projetoValido &&
        dataValida
    );
}


// ===============================
// SUBMIT DO FORMULÁRIO
// ===============================

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    limparErros();

    if (!validarFormulario()) {
        return;
    }

    // Cria objeto com os dados da demanda
    const demanda = {
        titulo: titulo.value.trim(),
        descricao: descricao.value.trim(),
        tipo: tipo.value,
        prioridade: prioridade.value,
        projetoId: Number(projeto.value),
        prazo: dataLimite.value || null
    };

    try {
        const resposta = await fetch("/demandas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(demanda)
        });

        const dados = await resposta.json().catch(function () {
            return {};
        });

        if (!resposta.ok) {
            alert(dados.erro || "Erro ao cadastrar demanda.");
            return;
        }

        // Cadastro realizado com sucesso
        resultado.textContent = JSON.stringify(dados, null, 2);
        painelResultado.style.display = "block";

        // Rola a tela até o resultado
        painelResultado.scrollIntoView({ behavior: "smooth" });
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
});


// ===============================
// BOTÃO CANCELAR
// ===============================

btnCancelar.addEventListener("click", function () {
    form.reset();
    limparErros();
    painelResultado.style.display = "none";
});


// ===============================
// VALIDAÇÃO EM TEMPO REAL
// ===============================

titulo.addEventListener("blur", validarTitulo);
descricao.addEventListener("blur", validarDescricao);

tipo.addEventListener("change", validarTipo);
prioridade.addEventListener("change", validarPrioridade);
projeto.addEventListener("change", validarProjeto);
dataLimite.addEventListener("change", validarData);

carregarProjetos();
