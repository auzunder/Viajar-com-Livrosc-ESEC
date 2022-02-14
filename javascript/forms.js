//localStorage.clear()

function saveData() {
    localStorage.clear();

    var nome = document.getElementById("Nome").value;
    localStorage.setItem('Nome' , nome);
    
    var dtNasc = new Date(document.getElementById("dtNasc").value);
        dia = dtNasc.getDate();
        mes = dtNasc.getMonth() + 1;
        ano = dtNasc.getFullYear();

    
    localStorage.setItem('Dia' , dia);
    localStorage.setItem('Mes' , mes);
    localStorage.setItem('Ano' , ano);

    var Morada = document.getElementById("Morada").value;
    localStorage.setItem('Morada' , Morada);
    
    var localidade = document.getElementById("Localidade").value;
    localStorage.setItem('Localidade' , localidade);

    var codPost4 = document.getElementById("codPostal4").value;
    localStorage.setItem('CodPost4' , codPost4);

    var codPost3 = document.getElementById("codPostal3").value;
    localStorage.setItem('CodPost3' , codPost3);

    var Email = document.getElementById("Email").value;
    localStorage.setItem('Email' , Email);
    
    var tlm = document.getElementById("Telemovel").value;
    localStorage.setItem('Telemovel' , tlm);

    let genEscolhido = document.getElementsByName("genero");
    for (var i = 0, length = genEscolhido.length; i < length; i++) {
        if (genEscolhido[i].checked) {

            genPessoa = genEscolhido[i].value;
    
            break;
        }
    }

    localStorage.setItem('Genero',genPessoa);

    
}
function saveData2() {

    var identificacao = document.getElementById('identificacao');
    var idSelecionado = identificacao.options[identificacao.selectedIndex].text;
    localStorage.setItem('Identificacao' , idSelecionado);
    
    var Num = document.getElementById("Num").value;
    localStorage.setItem('NumeroID' , Num);
    
    var profissao = document.getElementById("profissao").value;
    localStorage.setItem('Profissao' , profissao);
    
    var msg = document.getElementById("mensagem").value;
    localStorage.setItem('Mensagem' , msg);
    
}


function formTxt() {


    var confirmo = document.getElementById("confirmo");
    var aceito = document.getElementById("aceito");
    console.log(confirmo.checked);
    console.log(aceito.checked);
    if (confirmo.checked == true && aceito.checked == true) {
        var textToWrite = 
        'Nome: ' + localStorage.getItem('Nome') + '\n' +
        'Data de nascimento: ' + localStorage.getItem('Dia') + '/'  + localStorage.getItem('Mes') + '/'  + localStorage.getItem('Ano') +  '\n' +
        'Morada: ' + localStorage.getItem('Morada') + '\n' +
        'Localidade: ' + localStorage.getItem('Localidade') + '\n' +
        'Código Postal: ' + localStorage.getItem('CodPost4') + '-'  + localStorage.getItem('CodPost3') + '\n' +
        'E-mail: ' + localStorage.getItem('Email') + '\n' +
        'Telemóvel: ' + localStorage.getItem('Telemovel') + '\n' +
        'Género: ' + localStorage.getItem('Genero') + '\n' +
        localStorage.getItem('Identificacao') + ': ' + localStorage.getItem('NumeroID') + '\n' +
        'Profissão: ' + localStorage.getItem('Profissao') + '\n' +
        'Mensagem: ' + localStorage.getItem('Mensagem');

        var textFileAsBlob = new Blob([textToWrite], {
            type: 'text/plain'
        });
        var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
    
        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
    
        if(window.webkitURL != null) {
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        downloadLink.click();
    }   
    console.log(textToWrite);
    }   

    