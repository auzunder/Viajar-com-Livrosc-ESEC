var modal = document.getElementById("registoPopUp")

function clearInputs() {
    if (modal == document.getElementById("registoPopUp")){
        document.getElementById("nome").value = '';
        document.getElementById("emailReg").value = '';
        
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

function fechar(id) {
    modal = document.getElementById(id)
    modal.style.display = "none"
    clearInputs()
}

function abrirFechar(popUpaAbrir, popUpafechar, check) {
    if(check == false){
        fechar(popUpafechar);
        abrir(popUpaAbrir);
    }
    else{
        var name = document.getElementById("nome");
        var email = document.getElementById("emailReg");
        var pass1 = document.getElementById("password1");
        var pass2 = document.getElementById("password2");
        if(name.value != ''){
            if(email.value.includes('@') && email.value.includes('.')){
                if(pass1.value != '' && pass2.value != ''){
                    if(pass1.value == pass2.value){
                        abrir(popUpaAbrir);
                        fechar(popUpafechar);
                    }else{
                        //pass2.setCustomValidity('É necessário que a Password seja igual à repetição da mesma');
                        alert("A password repedida não corresponde à password original.")
                        console.log("A password repedida não corresponde à password original.")
                    };
                }else{
                    //pass1.setCustomValidity('É necessário que prencher a Password');
                    //pass2.setCustomValidity('É necessário que prencher a Repetição de Password');
                    console.log("A password não pode estar vazia")
                };
            }else{
                //email.setCustomValidity('É necessário que prencher o email');
                console.log("É necessário email, parental ou pessoal, para poder recuperar password.")
            };
        }else{
            //name.setCustomValidity('É necessário que prencher o nome');
            console.log("É necessário que prencher o nome")
        };
    }
}

window.onclick = function (event){
    if (event.target == modal){
        clearInputs()
        modal.style.display = "none"
    }
}