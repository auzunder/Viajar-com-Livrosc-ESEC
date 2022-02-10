var opened_answer = 0 //0 quer dizer que nenhuma está aberta

function open_answer(index) {
    for (var i = 0; i < document.getElementsByClassName("questao").length; i++){
        document.getElementsByClassName("resposta")[i].classList.remove("show");
        if (i != document.getElementsByClassName("questao").length){
            document.getElementsByClassName("questao")[i].classList.remove("last");
        }
        console.log(document.getElementsByClassName("questao")[i]);
    }
    if ( index != opened_answer){
        var element_questao = document.getElementsByClassName("questao")[index - 1];
        element_questao.classList.add("last");
        opened_answer = index //altera o 0 para o index (+1) da questão que está aberta
        console.log("element_questao: ", element_questao)
        var element_resposta = document.getElementsByClassName("resposta")[index - 1];
        element_resposta.classList.add("show");
        console.log("element_resposta: ", element_resposta)
    }
    else {
        document.getElementsByClassName("resposta")[index].classList.remove("show");
        if (i != document.getElementsByClassName("questao").length){
            document.getElementsByClassName("questao")[index].classList.remove("last");
        }
        opened_answer = 0 //0 quer dizer que nenhuma está aberta
        console.log(document.getElementsByClassName("questao")[index]);
    }
}