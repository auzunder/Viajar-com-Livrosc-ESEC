//Dicionário com todas as sessões Planeadas

//key:livro -> Nome do livro
//key:ref -> Referência interna do livro
//key:data -> Data Integer no formato AAAAMMDD
//key:hora -> Hora a que a sessão vai decorrer
//key:minuto -> Minuto a que a sessão vai decorrer
//key:duração -> Duração em minutos da sessão
//key:orador -> Nome do Orador
//key:genero_orador -> Gênero do Orador
var calendar_books = [
    {livro: "As Aventuras de sininho", ref:"00001", data: 20220215, hora:18, minuto:20, duração:120, orador: "Carolina Batista", genero_orador: "f", identificaçao_orador: "0001", plataforma:"Zoom"},
    {livro: "A máquina de retrato", ref:"00006", data: 20220217, hora:07, minuto:30, duração:120, orador: "Duarte Pacheco", genero_orador: "m", identificaçao_orador: "0003", plataforma:"MicrosoftTeams"},
    {livro: "As Aventuras de sininho", ref:"00001", data: 20220218, hora:11, minuto:20, duração:120, orador: "Rita Moura", genero_orador: "f", identificaçao_orador: "0006", plataforma:"Zoom"},
    {livro: "As Aventuras de sininho", ref:"00001", data: 20220620, hora:11, minuto:20, duração:120, orador: "Carolina Batista", genero_orador: "f", identificaçao_orador: "0001", plataforma:"MicrosoftTeams"},
    {livro: "Todos Devemos ser Feministas", ref:"00002", data: 20220320, hora:14, minuto:00, duração:90, orador: "Josefa Alexandra Pereira Carriço", genero_orador: "f", identificaçao_orador: "0002", plataforma:"Skype"},
    {livro: "Posso Cheirar-te o Rabo?", ref:"00003", data: 20220721, hora:09, minuto:30, duração:70, orador: "Duarte Pacheco", genero_orador: "m", identificaçao_orador: "0003", plataforma:"Zoom"},
    {livro: "O Leao que temos cá dentro", ref:"00004", data: 20220324, hora:12, minuto:50, duração:120, orador: "Yasmin Assunção", genero_orador: "f", identificaçao_orador: "0004", plataforma:"Zoom"},
    {livro: "Baleia na banheira", ref:"00005", data: 20220205, hora:16, minuto:00, duração:40, orador: "Josefina Ferreira Rodrigues", genero_orador: "f", identificaçao_orador: "0005", plataforma:"Zoom"},
    {livro: "A máquina de retrato", ref:"00006", data: 20220206, hora:07, minuto:30, duração:120, orador: "Duarte Pacheco", genero_orador: "m", identificaçao_orador: "0003", plataforma:"MicrosoftTeams"},
    {livro: "As Aventuras de sininho", ref:"00001", data: 20220120, hora:11, minuto:20, duração:120, orador: "Rita Moura", genero_orador: "f", identificaçao_orador: "0006", plataforma:"Zoom"},
    {livro: "Todos Devemos ser Feministas", ref:"00002", data: 20220420, hora:14, minuto:00, duração:90, orador: "Josefa Alexandra Pereira Carriço", genero_orador: "f", identificaçao_orador: "0002", plataforma:"Zoom"},
    {livro: "Posso Cheirar-te o Rabo?", ref:"00003", data: 20220421, hora:09, minuto:30, duração:70, orador: "Josefina Ferreira Rodrigues", genero_orador: "f", identificaçao_orador: "0005", plataforma:"Zoom"},
    {livro: "O Leao que temos cá dentro", ref:"00004", data: 20220324, hora:12, minuto:50, duração:120, orador: "Nádia Maia", genero_orador: "f", identificaçao_orador: "0007", plataforma:"Zoom"},
    {livro: "Baleia na banheira", ref:"00005", data: 20220505, hora:16, minuto:00, duração:40, orador: "Jéssica Azevedo", genero_orador: "f", identificaçao_orador: "0008", plataforma:"Skype"},
    {livro: "A máquina de retrato", ref:"00006", data: 20220206, hora:07, minuto:30, duração:120, orador: "José Pereira Fernades Daniel", genero_orador: "m", identificaçao_orador: "0009", plataforma:"Presencial"}
]

function reporDataOriginal() {
    calendar_books = [
        {livro: "As Aventuras de sininho", ref:"00001", data: 20220215, hora:18, minuto:20, duração:120, orador: "Carolina Batista", genero_orador: "f", identificaçao_orador: "0001", plataforma:"Zoom"},
        {livro: "A máquina de retrato", ref:"00006", data: 20220217, hora:07, minuto:30, duração:120, orador: "Duarte Pacheco", genero_orador: "m", identificaçao_orador: "0003", plataforma:"MicrosoftTeams"},
        {livro: "As Aventuras de sininho", ref:"00001", data: 20220218, hora:11, minuto:20, duração:120, orador: "Rita Moura", genero_orador: "f", identificaçao_orador: "0006", plataforma:"Zoom"},
        {livro: "As Aventuras de sininho", ref:"00001", data: 20220620, hora:11, minuto:20, duração:120, orador: "Carolina Batista", genero_orador: "f", identificaçao_orador: "0001", plataforma:"MicrosoftTeams"},
        {livro: "Todos Devemos ser Feministas", ref:"00002", data: 20220320, hora:14, minuto:00, duração:90, orador: "Josefa Alexandra Pereira Carriço", genero_orador: "f", identificaçao_orador: "0002", plataforma:"Skype"},
        {livro: "Posso Cheirar-te o Rabo?", ref:"00003", data: 20220721, hora:09, minuto:30, duração:70, orador: "Duarte Pacheco", genero_orador: "m", identificaçao_orador: "0003", plataforma:"Zoom"},
        {livro: "O Leao que temos cá dentro", ref:"00004", data: 20220324, hora:12, minuto:50, duração:120, orador: "Yasmin Assunção", genero_orador: "f", identificaçao_orador: "0004", plataforma:"Zoom"},
        {livro: "Baleia na banheira", ref:"00005", data: 20220205, hora:16, minuto:00, duração:40, orador: "Josefina Ferreira Rodrigues", genero_orador: "f", identificaçao_orador: "0005", plataforma:"Zoom"},
        {livro: "A máquina de retrato", ref:"00006", data: 20220206, hora:07, minuto:30, duração:120, orador: "Duarte Pacheco", genero_orador: "m", identificaçao_orador: "0003", plataforma:"MicrosoftTeams"},
        {livro: "As Aventuras de sininho", ref:"00001", data: 20220120, hora:11, minuto:20, duração:120, orador: "Rita Moura", genero_orador: "f", identificaçao_orador: "0006", plataforma:"Zoom"},
        {livro: "Todos Devemos ser Feministas", ref:"00002", data: 20220420, hora:14, minuto:00, duração:90, orador: "Josefa Alexandra Pereira Carriço", genero_orador: "f", identificaçao_orador: "0002", plataforma:"Zoom"},
        {livro: "Posso Cheirar-te o Rabo?", ref:"00003", data: 20220421, hora:09, minuto:30, duração:70, orador: "Josefina Ferreira Rodrigues", genero_orador: "f", identificaçao_orador: "0005", plataforma:"Zoom"},
        {livro: "O Leao que temos cá dentro", ref:"00004", data: 20220324, hora:12, minuto:50, duração:120, orador: "Nádia Maia", genero_orador: "f", identificaçao_orador: "0007", plataforma:"Zoom"},
        {livro: "Baleia na banheira", ref:"00005", data: 20220505, hora:16, minuto:00, duração:40, orador: "Jéssica Azevedo", genero_orador: "f", identificaçao_orador: "0008", plataforma:"Skype"},
    {livro: "A máquina de retrato", ref:"00006", data: 20220206, hora:07, minuto:30, duração:120, orador: "José Pereira Fernades Daniel", genero_orador: "m", identificaçao_orador: "0009", plataforma:"Presencial"}
    ]
    window.location.hash = ''
    defaultFilters()
}

// Correção dos Integers de 1 dígito para String com 2 dígitos
function correçãoIntStr(sessao) {
    if(String(sessao.minuto).length == 1){
        var value = '0'+sessao.minuto
        return String(value)
    }else{
        return String(sessao.minuto)
    }
}

//Função para tranformar a data em formato AAAAMMDD em DD/MM/AAAA e adicionar ao dicionário
function reverse(string){
    var dataToString = String(string).split("").reverse().join("");
    var index = 0
    var valor = ""
    var list = []
    for (num of dataToString){
        index += 1
        if ((index == 2) || index == 4){
            list += String(num);
            valor += list.toString().split('').reverse().join("");
            valor += "/";
            list = []
        }
        else{
            list += String(num)
        }
    }
    valor += list.toString().split('').reverse().join("");
    return valor
}

//Função para alterar entre Orador e Oradora em HTML de acordo com o gênero
function mascFem(valor) {
    if (valor == "m"){
        return "Orador"
    }else if (valor == "f"){
        return "Oradora"
    }
}

// Obter Dia e Hora
var currentdate = new Date(); 
//Obter Ano de Hoje
var currentYear = String(currentdate.getFullYear())
//Obter Mês de Hoje
var currentMonth = "0"
if (String(currentdate.getMonth()+1).length == 1){
    currentMonth += String(currentdate.getMonth()+1);
}else{
    currentMonth = String(currentdate.getMonth()+1);
}
//Obter Dia de Hoje
var currentDate = "0"
if (String(currentdate.getDate()).length == 1){
    currentDate += String(currentdate.getDate());
}else{
    currentDate = String(currentdate.getDate());
}
//Obter Horas
var currentHour = "0"
if (String(currentdate.getHours()).length == 1){
    currentHour += String(currentdate.getHours());
}else{
    currentHour = String(currentdate.getHours());
}
//Obter Minutos
var currentMinute = "0"
if (String(currentdate.getMinutes()).length == 1){
    currentMinute += String(currentdate.getMinutes());
}else{
    currentMinute = String(currentdate.getMinutes());
}
//Compilação do dia de Hoje no formato pretendido
var datetime = currentYear + currentMonth + currentDate + "-" + currentHour + ":" + currentMinute 
var datetime_day = '' + currentYear + currentMonth + currentDate
console.log("Access date: " + datetime)

function defaultFilters() {
    // Criação de data juntamente com horario para organização em timeline
    for (livro of calendar_books){
        var hora = "0"
        if (String(livro.hora).length == 1){
            hora += String(livro.hora);
        }else{
            hora = String(livro.hora);
        }
        var data = String(livro.data)
        var minuto = String(livro.minuto)
        livro.dataCompleta = data + "-" + hora + ":" + minuto
    }
    
    // Remoção das sessões que já passaram
    calendar_books = calendar_books.filter(function(value, index, arr){ 
        return value.dataCompleta > datetime;
    });
    
    // Obraginzar sessões por data Crescente
    calendar_books.sort(function (a, b) {
        if (a.dataCompleta > b.dataCompleta) {
            // passar livro a frente um index
            return 1;
        }
        if (a.dataCompleta < b.dataCompleta) {
            // recuar livro um valor no index
            return -1;
        }
        // continuar na mesma posição
        return 0;
    });
}

// Organizar sessões (Escolha do Utilizador)
function filtrarOrganizar() {
    var organizarPor = document.getElementById("listaOrganizar").value;
    window.location.hash += '__OrgenizarPor=' + organizarPor;
    if (organizarPor == "title_a_z"){
        calendar_books.sort(function (a, b) {
            if (a.livro > b.livro) {
                // passar livro a frente um index
                return 1;
            }
            if (a.livro < b.livro) {
                // recuar livro um valor no index
                return -1;
            }
            // continuar na mesma posição
            return 0;
        });
    }else if (organizarPor == "title_z_a") {
        calendar_books.sort(function (a, b) {
            if (a.livro < b.livro) {
                return 1;
            }
            if (a.livro > b.livro) {
                return -1;
            }
            return 0;
        });
    }else if (organizarPor == "orador_a_z") {
        calendar_books.sort(function (a, b) {
            if (a.orador > b.orador) {
                return 1;
            }
            if (a.orador < b.orador) {
                return -1;
            }
            return 0;
        });
    }else if (organizarPor == "orador_z_a") {
        calendar_books.sort(function (a, b) {
            if (a.orador < b.orador) {
                return 1;
            }
            if (a.orador > b.orador) {
                return -1;
            }
            return 0;
        });
    }else if (organizarPor == "tempoCrescente") {
        calendar_books.sort(function (a, b) {
            if (a.duração > b.duração) {
                return 1;
            }
            if (a.duração < b.duração) {
                return -1;
            }
            return 0;
        });
    }else if (organizarPor == "tempoDecrescente") {
        calendar_books.sort(function (a, b) {
            if (a.duração < b.duração) {
                return 1;
            }
            if (a.duração > b.duração) {
                return -1;
            }
            return 0;
        });
    }else if (organizarPor == "dataCrescrente") {
        calendar_books.sort(function (a, b) {
            if (a.dataCompleta > b.dataCompleta) {
                return 1;
            }
            if (a.dataCompleta < b.dataCompleta) {
                return -1;
            }
            return 0;
        });
    }
};

function filtrarOrador() {
    var filtroOrador = document.getElementById("listaOradores").value;
    window.location.hash += 'FiltroOrador=' + filtroOrador;
    if (filtroOrador != 'Orador') {
        calendar_books = calendar_books.filter(function(value, index, arr){ 
            return value.identificaçao_orador == filtroOrador;
        });
    }
}

function filtrarData() {
    var filtroData = document.getElementById("listaData").value;
    window.location.hash += '__FiltroData=' + filtroData;
    if (filtroData == 'Data') {
        
    }else if(filtroData == 'hoje'){
        calendar_books = calendar_books.filter(function(value, index, arr){ 
            return value.data == parseInt(datetime_day);
        });
    }
    else if(filtroData == 'estaSemana'){
        calendar_books = calendar_books.filter(function(value, index, arr){ 
            return value.data >= parseInt(datetime_day) && value.data <= (parseInt(datetime_day)+7);
        });
    }
}

function filtrarPlataforma() {
    var filtroPlataforma = document.getElementById("listaPlataforma").value;
    window.location.hash += '__FiltroPlataforma=' + filtroPlataforma;
    if (filtroPlataforma != 'Plataforma') {
        calendar_books = calendar_books.filter(function(value, index, arr){ 
            return value.plataforma == filtroPlataforma;
        });
    }
}

function clearInputs() {
    document.getElementById("nome").value = '';
    document.getElementById("emailReg").value = '';
}

function abrir() {
    document.getElementById('registoPopUp').style.display = "flex"
    clearInputs()
}

function fechar() {
    var name = document.getElementById("nome");
    var email = document.getElementById("emailReg");
    if (name.value != '') {
        if(email.value.includes('@') && email.value.includes('.')){
            document.getElementById('registoPopUp').style.display = "none";
            alert("Sessão Agendada com sucesso!");
        }
        else{
            console.log("Prencha os dados");
        };
    }else{
        console.log("Prencha os dados");
    };
}

window.onclick = function (event){
    if (event.target == document.getElementById('registoPopUp')){
        document.getElementById('registoPopUp').style.display = "none"
    }
}


// Manipulação HTML
function printSessions(clear) {
    // Identidicação das colunas
    var colunaEsquerda = document.getElementById("containterLeftContent")
    var colunaDireita = document.getElementById("containterRightContent")
    // Limpar todas as colunas de sessões antes de adicionar as novas
    if (clear == true){
        colunaDireita.innerHTML = "";
        colunaEsquerda.innerHTML = "";
    }
    // Controlo de coluna de sessões
    var count = 0 
    // Adicionar todos as sessões ao HTML
    for (livro of calendar_books){
        count += 1;
        // Alterar entre adicionar na coluna da esquerda e direita
        if ((count % 2) == 1){
            // Adicionar sessão na coluna direita
            colunaDireita.innerHTML += '<div class="container right"> <div class="content"> <div class="infoLivro"> <div class="infoSessao"> <h2 class="title">'+ livro.livro 
            +'</h2> <p class="data" class>Data: '+ reverse(livro.data) +'</p> <p class="hora"> Hora: '+ livro.hora +'h'+ correçãoIntStr(livro) +'</p> <p class="duração">Duração: '+ livro.duração 
            +' Minutos</p> </div> <div class="infoOrador"> <h2 class="generoOrador">'+ mascFem(livro.genero_orador) +'</h2> <p class="orador">'+ livro.orador 
            +'</p> </div> <button class="boxInnerOutterShadow inscrição" id="inscrição_ref_'+ livro.ref 
            +'" type="button" onclick="abrir()">Inscrever na sessão</button> </div> <div class="imgLivro"> <img class="imgSrcCapaLivro" src="/Imagens/Calendário/Livro_'+ livro.ref 
            +'.jpg"> </div> </div> </div>'
        }else if ((count % 2) == 0){
            // Adicionar sessão na coluna esquerda
            colunaEsquerda.innerHTML += '<div class="container left"> <div class="content"> <div class="infoLivro"> <div class="infoSessao"> <h2 class="title">'+ livro.livro 
            +'</h2> <p class="data" class>Data: '+ reverse(livro.data) +'</p> <p class="hora"> Hora: '+ livro.hora +'h'+ correçãoIntStr(livro) +'</p> <p class="duração">Duração: '+ livro.duração 
            +' Minutos</p> </div> <div class="infoOrador"> <h2 class="generoOrador">'+ mascFem(livro.genero_orador) +'</h2> <p class="orador">'+ livro.orador 
            +'</p> </div> <button class="boxInnerOutterShadow inscrição" id="inscrição_ref_'+ livro.ref 
            +'" type="button" onclick="abrir()">Inscrever na sessão</button> </div> <div class="imgLivro"> <img class="imgSrcCapaLivro" src="/Imagens/Calendário/Livro_'+ livro.ref 
            +'.jpg"> </div> </div> </div>'
        }
    }
}