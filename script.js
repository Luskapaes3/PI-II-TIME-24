const formulario = document.querySelector("#formLogin");

const campoUsuario = document.querySelector("#usuario");
const erroUsuario = document.querySelector("#erroUsuario");
const reqUsuario = document.querySelector("#reqUsuario");

const campoSenha = document.querySelector("#senha");
const erroSenha = document.querySelector("#erroSenha");
const reqSenha = document.querySelector("#reqSenha");

const mensagemSucesso = document.querySelector("#mensagemSucesso");

// Itens da lista de requisitos (cada um vira verde quando cumprido)
const itemEmail = document.querySelector("#reqEmail");
const itemTelefone = document.querySelector("#reqTelefone");
const itemTamanho = document.querySelector("#reqTamanho");
const itemMaiuscula = document.querySelector("#reqMaiuscula");
const itemEspecial = document.querySelector("#reqEspecial");

//Verifica se é email (tem que ter @)
const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//Verifica se é um telefone (10 ou 11 numeros)
const formatoTelefone = /^[0-9]{10,11}$/;

//Verifica caracteres maisculos de A - Z
const formatoMaiuscula = /[A-Z]/;

//Verifica caracteres especiais
const formatoEspecial = /[!@#$%&*]/;

function mostrarErro(campo, elementoErro, mensagem){
    campo.classList.add("is-invalid");
    elementoErro.innerText = mensagem;
}

function limparErros() {
    campoUsuario.classList.remove("is-invalid");
    campoSenha.classList.remove("is-invalid");

    erroUsuario.innerText = "";
    erroSenha.innerText = "";

    mensagemSucesso.innerText = "";
}

// Liga ou desliga a classe "ok" de um item (verde com ✓)
function marcarItem(item, cumprido){
    item.classList.toggle("ok", cumprido);
}

// Confere os requisitos do campo de email/telefone
function atualizarRequisitosUsuario(){
    const usuario = campoUsuario.value.trim();

    marcarItem(itemEmail, formatoEmail.test(usuario));
    marcarItem(itemTelefone, formatoTelefone.test(usuario));
}

// Confere os requisitos do campo de senha
function atualizarRequisitosSenha(){
    const senha = campoSenha.value;

    marcarItem(itemTamanho, senha.length >= 6);
    marcarItem(itemMaiuscula, formatoMaiuscula.test(senha));
    marcarItem(itemEspecial, formatoEspecial.test(senha));
}

// A cada tecla digitada (input), atualiza os requisitos
campoUsuario.addEventListener("input", atualizarRequisitosUsuario);
campoSenha.addEventListener("input", atualizarRequisitosSenha);

// Ao clicar no campo (focus), mostra os requisitos
campoUsuario.addEventListener("focus", function () {
    reqUsuario.classList.add("visivel");
});

campoSenha.addEventListener("focus", function () {
    reqSenha.classList.add("visivel");
});

// Ao sair do campo (blur), esconde os requisitos
campoUsuario.addEventListener("blur", function () {
    reqUsuario.classList.remove("visivel");
});

campoSenha.addEventListener("blur", function () {
    reqSenha.classList.remove("visivel");
});

formulario.addEventListener("submit", function (event){
    event.preventDefault();
    limparErros();

    const usuario = campoUsuario.value.trim();
    const senha = campoSenha.value;

    let formValido = true;

    // Valida se o email ou telefone se eles não estão vazios 
    if (usuario === ""){
        mostrarErro(campoUsuario, erroUsuario, "Informe o email ou telefone.");
        formValido = false;
    }
    //Se tiver @, valida como um email
    else if (usuario.includes("@") && !formatoEmail.test(usuario)){
        mostrarErro(campoUsuario, erroUsuario, "Informe um email válido.");
        formValido = false;
    }
    //Se não tiver @, valida como telefone (10 ou 11 dígitos)
    else if (!usuario.includes("@") && !formatoTelefone.test(usuario)){
        mostrarErro(campoUsuario, erroUsuario, "Informe um telefone válido (10 ou 11 dígitos, só números).");
        formValido = false;
    }

    //Verifica se a senha não ta vazia
    if (senha === ""){
        mostrarErro(campoSenha, erroSenha, "A senha é obrigatória.");
        formValido = false;
    }
    //Verifica se a senha apresenta 6 ou mais caracteres
    else if (senha.length < 6){
        mostrarErro(campoSenha, erroSenha, "A senha deve ter no mínimo 6 caracteres.");
        formValido = false;
    }
    //Valida se a senha apresenta pelo menos um caracter maisculo
    else if (!formatoMaiuscula.test(senha)){
        mostrarErro(campoSenha, erroSenha, "A senha deve ter pelo menos uma letra maiúscula.");
        formValido = false;
    }
    //Valida se a senha apresenta pelo menos um caracter especial
    else if (!formatoEspecial.test(senha)){
        mostrarErro(campoSenha, erroSenha, "A senha deve ter pelo menos um caractere especial (! @ # $ % & *).");
        formValido = false;
    }

    // Se todas as exigencias foram feitas, o login é realizado com sucesso
    if (formValido){
        mensagemSucesso.innerText = "Login realizado com sucesso!";
        formulario.reset();

        // Como os campos foram limpos, os requisitos voltam ao cinza
        atualizarRequisitosUsuario();
        atualizarRequisitosSenha();

        window.open("https://www.rockstargames.com/VI", "_blank");
    }
});