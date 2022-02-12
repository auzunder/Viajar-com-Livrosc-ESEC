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


calendar_books = calendar_books.filter(function(value, index, arr){ 
    return value.dataCompleta > datetime;
});