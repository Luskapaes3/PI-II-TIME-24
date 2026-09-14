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

    return true;
}


function validarPrioridade() {
    if (prioridade.value === "") {
        mostrarErro("erroPrioridade", "Selecione a prioridade.");
        return false;
    }

    return true;
}


function validarStatus() {
    if (status.value === "") {
        mostrarErro("erroStatus", "Selecione o status da demanda.");
        return false;
    }

    return true;
}


function validarProjeto() {
    if (projeto.value === "") {
        mostrarErro("erroProjeto", "Selecione um projeto.");
        return false;
    }

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

    // Pega a data atual
    const hoje = new Date();

    // Remove horas, minutos, segundos e milissegundos
    hoje.setHours(0, 0, 0, 0);

    // Converte a data selecionada
    const dataSelecionada = new Date(valor + "T00:00:00");

    if (dataSelecionada < hoje) {
        mostrarErro(
            "erroData",
            "A data limite não pode ser anterior à data atual."
        );
        return false;
    }

    return true;
}



// ===============================
// BOTÃO CANCELAR
// ===============================

btnCancelar.addEventListener("click", function () {

    // Limpa o formulário
    form.reset();

    // Limpa mensagens de erro
    limparErros();

    // Esconde o resultado
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
