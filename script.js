const formulario = document.querySelector("#formLogin");

const campoUsuario = document.querySelector("#usuario");
const erroUsuario = document.querySelector("#erroUsuario");

const campoSenha = document.querySelector("#senha");
const erroSenha = document.querySelector("#erroSenha");

const mensagemSucesso = document.querySelector("#mensagemSucesso");

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

formulario.addEventListener("submit", function (event){
    event.preventDefault();
    limparErros();

    const usuario = campoUsuario.value.trim();
    const senha = campoSenha.value;

    let formValido = true;

    //Adiciona uma constante que verifica se é email (tem que ter @)
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //Adiciona uma constante que verifica se é um telefone (tem que ter numeros)
    const formatoTelefone = /^[0-9]{10,11}$/;

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

    //Adiciona uma constante que apresenta caracteres maisculos de A - Z
    const possuiMaiuscula = /[A-Z]/.test(senha);

    //Adiciona uma constante que apresenta caracteres especiais
    const possuiEspecial = /[!@#$%&*]/.test(senha);

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
    else if (!possuiMaiuscula){
        mostrarErro(campoSenha, erroSenha, "A senha deve ter pelo menos uma letra maiúscula.");
        formValido = false;
    }
    //Valida se a senha apresenta pelo menos um caracter especial
    else if (!possuiEspecial){
        mostrarErro(campoSenha, erroSenha, "A senha deve ter pelo menos um caractere especial (! @ # $ % & *).");
        formValido = false;
    }

    // Se todas as exigencias foram feitas, o login é realizado com sucesso
    if (formValido){
        mensagemSucesso.innerText = "Login realizado com sucesso!";
        formulario.reset();
         window.open("https://www.rockstargames.com/VI", "_blank");
    }
});