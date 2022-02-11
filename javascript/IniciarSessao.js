var modal = document.getElementById("registoPopUp")

function clearInputs() {
    if (modal == document.getElementById("registoPopUp")){
        document.getElementById("nome").value = '';
        document.getElementById("emailReg").value = '';
        document.getElementById("password1").value = '';
        document.getElementById("password2").value = '';
    }else if(modal == document.getElementById("iniciarSessaoPopUp")){
        document.getElementById("name").value = '';
        document.getElementById("password").value = '';
    };
}

function abrir(id) {
    modal = document.getElementById(id)
    modal.style.display = "flex"
    clearInputs()
}

function fechar(id, check) {
    if(check == false){
        modal = document.getElementById(id)
        modal.style.display = "none"
    }else{
        if(modal == document.getElementById("iniciarSessaoPopUp")){
            var name = document.getElementById("name");
            var pass = document.getElementById("password");
            if (name.value != '' && pass.value != '') {
                modal = document.getElementById(id)
                modal.style.display = "none"
                console.log("Sessão Iniciada!")
            }else{
                console.log("Prencha os dados")
            }
        }
    }
}

function abrirFechar(popUpaAbrir, popUpafechar, check) {
    if(check == false){
        fechar(popUpafechar, false);
        abrir(popUpaAbrir);
    }
    else{
        var name = document.getElementById("nome");
        var email = document.getElementById("emailReg");
        var pass1 = document.getElementById("password1");
        var pass2 = document.getElementById("password2");

        name.oninvalid = function (){name.setCustomValidity('É necessário que prencher o nome');};
        email.oninvalid = function (){email.setCustomValidity('É necessário que prencher o email');};
        pass1.oninvalid = function (){pass1.setCustomValidity('A password não pode estar vazia')};

        if(name.value != ''){
            if(email.value.includes('@') && email.value.includes('.')){
                if(pass1.value != '' && pass2.value != ''){
                    if(pass1.value == pass2.value){
                        fechar(popUpafechar, false);
                        abrir(popUpaAbrir);
                    }else{
                        pass2.setCustomValidity('A password repedida não corresponde à password original.');
                        console.log("A password repedida não corresponde à password original.")
                    };
                }else{
                    if (pass2.value == ''){
                        pass2.setCustomValidity('A password não pode estar vazia')
                    }
                    console.log("A password não pode estar vazia")
                };
            }else{
                console.log("É necessário email, parental ou pessoal, para poder recuperar password.")
            };
        }else{
            console.log("É necessário que prencher o nome")
        };
    }
}

window.onclick = function (event){
    if (event.target == modal){
        modal.style.display = "none"
    }
}