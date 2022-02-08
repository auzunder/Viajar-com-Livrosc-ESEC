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

// Escolher em lista um random
function randomNumber(choices) { 
    return choices[Math.floor(Math.random() * choices.length)];
} 

var calendar_books = [
    {livro: "As Aventuras de sininho", ref:"00001", data: 20220120, hora:11, minuto:20, duração:120, orador: "Josefa Alexandra Pereira Carriço", genero_orador: "f"},
    {livro: "Todos Devemos ser Feministas", ref:"00002", data: 20220120, hora:14, minuto:00, duração:90, orador: "Josefa Alexandra Pereira Carriço", genero_orador: "f"},
    {livro: "Posso Cheirar-te o Rabo?", ref:"00003", data: 20220121, hora:09, minuto:30, duração:70, orador: "Josefina Ferreira Rodrigues", genero_orador: "f"},
    {livro: "O Leao que temos cá dentro", ref:"00004", data: 20220124, hora:12, minuto:50, duração:120, orador: "Josefa Alexandra Pereira Carriço", genero_orador: "f"},
    {livro: "Baleia na banheira", ref:"00005", data: 20220205, hora:16, minuto:00, duração:40, orador: "Josefina Ferreira Rodrigues", genero_orador: "f"},
    {livro: "A máquina de retrato", ref:"00006", data: 20220206, hora:07, minuto:30, duração:120, orador: "José Pereira Fernades Daniel", genero_orador: "m"}
]

for (livro in calendar_books){
    calendar_books[livro].dataString = "Data: " + reverse(calendar_books[livro].data)
    calendar_books[livro].horario = "Hora: " + String(hora) + "h" + String(minuto)
    calendar_books[livro].duraçãoString = "Duração: " + String(duração) + "Minutos" + String(minuto)
    console.log(calendar_books[livro])
}

function filtrarCoise() {
    var calendar_books_length = Array.from(Array(calendar_books.length).keys());
    for (calendar_books_index of Array.from(Array(calendar_books.length).keys())){
        index = randomNumber(calendar_books_length);
        calendar_books_length.splice(index, 1)
        console.log(index)
        console.log(calendar_books_length)
        console.log(document.getElementsByClassName("title")[index].innerHTML);
        console.log(calendar_books[calendar_books_index].livro);
        document.getElementsByClassName("title")[index].innerHTML = calendar_books[calendar_books_index].livro;
        document.getElementsByClassName("data")[index].innerHTML = calendar_books[calendar_books_index].dataString;
        document.getElementsByClassName("hora")[index].innerHTML = calendar_books[calendar_books_index].horario;
        document.getElementsByClassName("duração")[index].innerHTML = calendar_books[calendar_books_index].duraçãoString;
        if (calendar_books[calendar_books_index].genero_orador == "m"){
            document.getElementsByClassName("generoOrador")[index].innerHTML = "Orador";
        }
        else if (calendar_books[calendar_books_index].genero_orador == "f"){
            document.getElementsByClassName("generoOrador")[index].innerHTML = "Oradora";
        };
        document.getElementsByClassName("orador")[index].innerHTML = calendar_books[calendar_books_index].orador;
        document.getElementsByClassName("inscrição")[index].id = "inscrição_ref_" + calendar_books[calendar_books_index].ref;
        document.getElementsByClassName("imgSrcCapaLivro")[index].src ="/Imagens/Calendário/Livro_"+calendar_books[calendar_books_index].ref+".jpg";
    };
};