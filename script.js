const form = document.getElementById("formDemanda");

const titulo = document.getElementById("titulo");
const descricao = document.getElementById("descricao");
const tipo = document.getElementById("tipo");
const prioridade = document.getElementById("prioridade");
const status = document.getElementById("status");
const projeto = document.getElementById("projeto");
const dataLimite = document.getElementById("dataLimite");

const painelResultado = document.getElementById("painelResultado");
const resultado = document.getElementById("resultado");
const btnCancelar = document.getElementById("btnCancelar");


// ===============================
// FUNÇÕES AUXILIARES
// ===============================

function mostrarErro(id, mensagem) {
    document.getElementById(id).textContent = mensagem;
}

function limparErros() {
    document.querySelectorAll(".erro").forEach(function (erro) {
        erro.textContent = "";
    });
}


// ===============================
// VALIDAÇÃO DO TÍTULO
// ===============================

function validarTitulo() {
    const valor = titulo.value.trim();

    if (valor === "") {
        mostrarErro("erroTitulo", "O título é obrigatório.");
        return false;
    }

    if (valor.length < 5) {
        mostrarErro("erroTitulo", "O título deve ter pelo menos 5 caracteres.");
        return false;
    }

    if (valor.length > 100) {
        mostrarErro("erroTitulo", "O título deve ter no máximo 100 caracteres.");
        return false;
    }

    mostrarErro("erroTitulo", "");
    return true;
}


// ===============================
// VALIDAÇÃO DA DESCRIÇÃO
// ===============================

function validarDescricao() {
    const valor = descricao.value.trim();

    if (valor === "") {
        mostrarErro("erroDescricao", "A descrição é obrigatória.");
        return false;
    }

    if (valor.length < 10) {
        mostrarErro(
            "erroDescricao",
            "A descrição deve ter pelo menos 10 caracteres."
        );
        return false;
    }

    if (valor.length > 500) {
        mostrarErro(
            "erroDescricao",
            "A descrição deve ter no máximo 500 caracteres."
        );
        return false;
    }

    mostrarErro("erroDescricao", "");
    return true;
}


// ===============================
// VALIDAÇÃO DOS SELECTS
// ===============================

function validarTipo() {
    if (tipo.value === "") {
        mostrarErro("erroTipo", "Selecione o tipo da demanda.");
        return false;
    }

    mostrarErro("erroTipo", "");
    return true;
}

function validarPrioridade() {
    if (prioridade.value === "") {
        mostrarErro("erroPrioridade", "Selecione a prioridade.");
        return false;
    }

    mostrarErro("erroPrioridade", "");
    return true;
}

function validarStatus() {
    if (status.value === "") {
        mostrarErro("erroStatus", "Selecione o status da demanda.");
        return false;
    }

    mostrarErro("erroStatus", "");
    return true;
}

function validarProjeto() {
    if (projeto.value === "") {
        mostrarErro("erroProjeto", "Selecione um projeto.");
        return false;
    }

    mostrarErro("erroProjeto", "");
    return true;
}


// ===============================
// VALIDAÇÃO DA DATA
// ===============================

function validarData() {
    const valor = dataLimite.value;

    if (valor === "") {
        mostrarErro("erroData", "A data limite é obrigatória.");
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
            "A data limite não pode ser anterior à data atual."
        );
        return false;
    }

    mostrarErro("erroData", "");
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
    const statusValido = validarStatus();
    const projetoValido = validarProjeto();
    const dataValida = validarData();

    return (
        tituloValido &&
        descricaoValida &&
        tipoValido &&
        prioridadeValida &&
        statusValido &&
        projetoValido &&
        dataValida
    );
}


// ===============================
// SUBMIT DO FORMULÁRIO
// ===============================

form.addEventListener("submit", function (event) {
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
        status: status.value,
        projeto: projeto.value,
        dataLimite: dataLimite.value
    };

    // Exibe os dados formatados
    resultado.textContent = JSON.stringify(demanda, null, 2);

    painelResultado.style.display = "block";

    // Opcional: rola a tela até o resultado
    painelResultado.scrollIntoView({
        behavior: "smooth"
    });
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
status.addEventListener("change", validarStatus);
projeto.addEventListener("change", validarProjeto);
dataLimite.addEventListener("change", validarData);
