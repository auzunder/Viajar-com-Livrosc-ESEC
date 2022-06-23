const session = require('express-session');
const express = require('express');
const sha1 = require('sha1');
const fs = require('fs');
const { send } = require('process');
const { receiveMessageOnPort } = require('worker_threads');
const { Console } = require('console');

// ALGORITMO DE CIRAÇÃO DE ID UNICO :)
//  var time_based_id = Date.now().toString(16).slice(2)
//  var random_based_id = Math.random().toString(16).slice(2)
//  var id = time_based_id + random_based_id


const servidor = express();
var porta = 8080;

servidor.use(express.urlencoded({
    extended: true
}));

servidor.use(express.static("public"));

//  Sessão
servidor.use(session({
    secret: "supercalifragilisticexpialidocious",
    resave: false,
    saveUninitialized: true
}));

// Ligação ao servidor
servidor.listen(porta, function () {
    console.log("servidor a ser executado em http://localhost://" + porta);
});

// Leitura de HTML repetido
try{
    var head = fs.readFileSync('head.html', 'utf-8');
    var topo = fs.readFileSync('NavBar.html', 'utf-8');
    var fundo = fs.readFileSync('Footer.html', 'utf-8');
    var loginRegist = fs.readFileSync('LoginAndRegister.html', 'utf-8');
}
catch (error){
    console.error("Erro ao ler ficheiros de NarBar ou Footer.")
    console.error(error)
}

// Constantes de estruturação HTML
const iniciarHtml = '<!DOCTYPE html><html><head>';
const acabarHead = '</head><body>'
const acabarHtml = '</body></html>'


// Midleware sessao anonima
const logging = (req, res, next) => {
    console.log("Path: ", req.session);
    console.log("Date: ", Date());
    next()
}

servidor.get("/", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var home_content = fs.readFileSync('Home.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Home | Viajar com Livros </title>';
    // Css único da página
    html += '<link type="text/css" rel="stylesheet" href="/css/home.css">';
    // JavaScript para dados de Sessões de Livros
    html += '<script src="/javascript/CalendarioMetadata.js"></script>';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    html += loginRegist;
    // Conteudo da pagina
    html += home_content;
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);

    log(req.session.username, req.path);
});

servidor.post("/Login", logging, function (req, res) {
    var {email, password} = req.body;
    var loginCar = {"email" : email, "password" : sha1(password)};
    //console.log(loginCar);
    var logins = [];
    var emails = [];
    var index;
    // Ler ficheiro atual JSON
    fs.readFile('LoginInformations.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            if (data){
                logins_JSON = JSON.parse(data);
                for(var i in logins_JSON){
                    emails.push(logins_JSON[i].email);
                    if (logins_JSON[i].email == loginCar.email){
                        index = i;
                        req.session.index = i;
                        //console.log(req.session.index);
                    }
                    logins.push(logins_JSON[i]);
                }
                //console.log(logins);
                if (emails.includes(loginCar.email)){
                    //console.log("O email inserido já foi registado anteriormente");
                    if (loginCar.password == logins[index].password){
                        //console.log("O email e password foram digitados corretamente");
                        req.session.username = logins[index].nome;
                        req.session.email = logins[index].email;
                        if (logins[index].idade){
                            req.session.idade = logins[index].idade;
                        };
                        if (logins[index].genero){
                            req.session.genero = logins[index].genero;
                        };
                        if (logins[index].contacto){
                            req.session.contacto = logins[index].contacto;
                        };
                        res.redirect("/conta") // É redirecionado diretamente para pagina de conta
                    }else{
                        //console.log("Password não digitada corretamente.");
                        res.send("Password digitada <bold>incorretamente.</bold><br><a href='/'>Voltar à Pagina inicial</a> ")
                    }
                }else{
                    //console.log("Utilizador nao registado");
                    res.send("Utilizador nao registado<br><a href='/'>Voltar à Pagina inicial</a> ")
                }
            }
        }
    });
    log(req.session.username, req.path);
})

servidor.post("/Registo", logging, function (req, res) {
    var {nomeRegisto, emailRegisto, passwordRegisto, confirmarPass} = req.body;
    if (passwordRegisto==confirmarPass){
        var loginCar = {"nome": nomeRegisto, 
                        "email" : emailRegisto, 
                        "password" : sha1(passwordRegisto), 
                        "telemovel": "", 
                        "idade": "", 
                        "genero": "", 
                        "Agenda": [], 
                        "Favoritos": [], 
                        "Comentarios": 
                            [{"LivroComment":"", 
                            "DataComment": "", 
                            "Comentario": ""}]};
        var logins = [];
        var emails = [];
        fs.readFile('LoginInformations.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                if (data){
                    logins_JSON = JSON.parse(data);
                    for(var i in logins_JSON){
                        emails.push(logins_JSON[i].email);
                        logins.push(logins_JSON[i]);
                    }
                    //console.log(logins);
                    if (emails.includes(loginCar.email)){
                        //console.log("O email inserido já foi registado anteriormente")
                        res.send("O email inserido já foi registado anteriormente<br><a href='/'>Voltar à Pagina inicial</a> ")
                    }else{
                        // Escrever tudo de novo no JSON
                        logins.push(loginCar);
                        //console.log(loginCar);
                        json = JSON.stringify(logins);
                        //console.log(json);
                        fs.writeFile('LoginInformations.json', json, 'utf8', function (err) {
                            if (err) {
                                console.error("erro ao guardar os dados no servidor");
                                res.send("erro ao guardar os dados no servidor<br><a href='/'>Voltar à Pagina inicial</a> ")
                            }
                            else {
                                //console.log("Dados guardados com sucesso no servidor");
                                res.send("Utilizador Registado com sucesso. Para continuar, faça o login.<br><a href='/'>Voltar à Pagina inicial</a> ")
                            };
                        });
                    }
                }else{
                    logins.push(loginCar);
                    //console.log(loginCar);
                    json = JSON.stringify(logins);
                    //console.log(json);
                    fs.writeFile('LoginInformations.json', json, 'utf8', function (err) {
                        if (err) {
                            console.error("erro ao guardar os dados no servidor");
                            res.send("erro ao guardar os dados no servidor<br><a href='/'>Voltar à Pagina inicial</a> ")
                        }
                        else {
                            //console.log("Dados guardados com sucesso no servidor");
                            res.send("Utilizador Registado com sucesso. Para continuar, faça o login.<br><a href='/'>Voltar à Pagina inicial</a> ")
                        };
                    });
                }
            }
        });
        log(req.session.username, req.path);
    }else{
        var htmlForbiden = "<!DOCTYPE  html><html><head></head><body><h2>Error Code: 406</h2><br><p>Not Acceptable: Tens de confirmar a tua password corretamente </p></body></html>"
        res.status(406).send(htmlForbiden);
    }
})

servidor.get("/sobre_nos", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var sobre_nos_content = fs.readFileSync('SobreOProjeto.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title>Viajar com livros | Sobre</title>';
    // Css único da página
    html += '<link rel="stylesheet" href="css/sobre.css">';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += sobre_nos_content;
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);
    log(req.session.username, req.path);
})

servidor.get("/calendario", logging, function (req, res) {
     // Tentar abrir ficheiro
    try {
        var calendario_content = fs.readFileSync('Calendario.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title>Viajar com livros | Calendário</title>';
    // Css único da página
    html += '<link rel="stylesheet" href="css/calendario.css">';
    // JavaScript unico da página
    html += '<script src="/javascript/CalendarioMetadata.js"></script>';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += calendario_content;
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);
    log(req.session.username, req.path);
})

servidor.get("/biblioteca", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var biblioteca_content = fs.readFileSync('Biblioteca.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Biblioteca | Viajar com Livros </title>';
    // Css único da página
    html += '<link type="text/css" rel="stylesheet" href="/css/biblioteca.css">';
    // JavaScript para dados de Sessões de Livros
    html += '<script src="/javascript/CalendarioMetadata.js"></script>';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += biblioteca_content;
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);
    log(req.session.username, req.path);

})

servidor.get("/fotografias", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var galeria_foto_content = fs.readFileSync('Fotografias.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Home | Viajar com Livros </title>';
    // Css único da página
    html += '<link rel="stylesheet" type="text/css" href="css/galeria.css">';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += galeria_foto_content;
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);
    log(req.session.username, req.path);
})

servidor.get("/videos", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var galeria_video_content = fs.readFileSync('videos.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Galeria Videos | Viajar com Livros </title>';
    // Css único da página
    html += '<link type="text/css" rel="stylesheet" href="/css/videos.css">';
    // JavaScript para dados de Sessões de Livros
    html += '<script src="/javascript/CalendarioMetadata.js"></script>';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += galeria_video_content;
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);
    log(req.session.username, req.path);
})

servidor.get("/noticias", logging, function (req, res) {
   
    // Tentar abrir ficheiro
    try {
        var noticias_content = fs.readFileSync('Noticias/Noticias.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Noticias | Viajar com Livros </title>';
    // Css único da página
    html += '<link type="text/css" rel="stylesheet" href="/css/noticias.css">';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += noticias_content;
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);
    log(req.session.username, req.path);
})

servidor.get("/voluntariado_Page1", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var voluntariado_content = fs.readFileSync('forms.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Voluntariado | Viajar com Livros </title>';
    // Css único da página
    html += '<link rel="stylesheet" href="css/forms2.css"><link rel="stylesheet" href="css/infoConta.css href="css/forms.css">';
    // JavaScript para dados de Sessões de Livros
    html += '<script src="/javascript/forms.js"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += voluntariado_content;
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);
    log(req.session.username, req.path);
})

servidor.get("/voluntariado_Page2", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var voluntariado2_content = fs.readFileSync('forms2.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Voluntariado | Viajar com Livros </title>';
    // Css único da página
    html += '<link type="text/css" rel="stylesheet" href="/css/home.css">';
    // JavaScript para dados de Sessões de Livros
    html += '<script src="/javascript/CalendarioMetadata.js"></script>';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += voluntariado2_content;
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);
    log(req.session.username, req.path);
})

servidor.get("/voluntariado_Page3", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var voluntariado3_content = fs.readFileSync('forms3.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Voluntariado | Viajar com Livros </title>';
    // Css único da página
    html += '<link rel="stylesheet" href="css/forms3.css"><link rel="stylesheet" href="css/infoConta.css">';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += voluntariado3_content;
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);
    log(req.session.username, req.path);
})

servidor.get("/processaTerminoSessao", logging, function (req, res) {
    req.session.destroy();
    res.redirect("/");
})

servidor.get("/conta", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var conta_content = fs.readFileSync('InformacoesDeConta.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Informações de Conta | Viajar com Livros </title>';
    // Css único da página
    html += '<link type="text/css" rel="stylesheet" href="/css/infoConta.css">';
    html += '<link type="text/css" rel="stylesheet" href="/css/areaLeitor.css">';
    // JavaScript para dados de Sessões de Livros
    html += '<script src="/javascript/CalendarioMetadata.js"></script>';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/processaTerminoSessao" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Terminar Sessão</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += conta_content;
    const informacao = fs.readFileSync('LoginInformations.json', 'utf8', function readFileCallback(err){
        if (err){
            console.log(err);
        }
    });
    var DadosTotais =(JSON.parse(informacao));
    //console.log("path: ", req.path, "user: ", req.session.username)
    //console.log(req.session.index)
    if (req.session.index) {
        var nome_infoConta = DadosTotais[req.session.index].nome;
        var email_infoConta = DadosTotais[req.session.index].email;
        var telemovel_infoConta = DadosTotais[req.session.index].telemovel;
        var idade_infoConta = DadosTotais[req.session.index].idade;
        var genero_infoConta = DadosTotais[req.session.index].genero;
        html += '<div class="flexboxStyle"><p class="userName">'+nome_infoConta+'</p></div><p class="contentResponsiveFont">Idade: '+ idade_infoConta +'</p><p class="contentResponsiveFont">Gênero: '+ genero_infoConta +'</p><p class="contentResponsiveFont">Email Parental: '+ email_infoConta +'</p><p class="contentResponsiveFont">Contacto telefónico: '+ telemovel_infoConta +'</p><div class="alterarUserData flexboxStyle"><a href="/contaAlterar"><button class="contentResponsiveFont boxInnerOutterShadow">Alterar</button></a></div></div></div></div>';
        html += '</div>'; 
        // Footer
        html += fundo;
        // Fechar HTML
        html += acabarHtml;
        // Enviar HTML final para o cliente
        res.send(html);
    }else{
        var htmlForbiden = "<!DOCTYPE  html><html><head></head><body><h2>Error Code: 403</h2><br><p>Forbiden: Inicia sessão para poderes entrar em /conta </p></body></html>"
        res.status(403).send(htmlForbiden);
    }
    log(req.session.username, req.path);
});

servidor.get("/contaAlterar", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var contaalterar_content = fs.readFileSync('InformacoesDeConta_AlterarInfo.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Informações de Conta Alterar | Viajar com Livros </title>';
    // Css único da página
    html += '<link type="text/css" rel="stylesheet" href="/css/infoConta.css">';
    html += '<link type="text/css" rel="stylesheet" href="/css/areaLeitor.css">';
    // JavaScript para dados de Sessões de Livros
    html += '<script src="/javascript/CalendarioMetadata.js"></script>';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="processaTerminoSessao" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Terminar Sessão</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += contaalterar_content;

    if (req.session.index) {
        const informacao = fs.readFileSync('LoginInformations.json', 'utf8', function readFileCallback(err){
            if (err){
                console.log(err);
            }
        });
        var DadosTotais =(JSON.parse(informacao));
        //console.log("path: ", req.path, "user: ", req.session.username)
        var nome_infoConta = DadosTotais[req.session.index].nome;
        var email_infoConta = DadosTotais[req.session.index].email;
        var telemovel_infoConta = DadosTotais[req.session.index].telemovel;
        var idade_infoConta = DadosTotais[req.session.index].idade;
        var genero_infoConta = DadosTotais[req.session.index].genero;
        html += '<form action = "/processaContaAlterar" method="post"><div class="flexboxStyle"><p class="userName">'+nome_infoConta+'</p></div>';
        html += '<p class="contentResponsiveFont">Nome:<input name="nomeAlterado" id="inputName" class="inputInfoPerfil inputMargem" placeholder="'+nome_infoConta+'"></input></p>';
        html += '<p class="contentResponsiveFont">Idade:<input type="number" name="idadeAlterado" id="inputAge" class="inputInfoPerfil inputMargem" placeholder="'+idade_infoConta+'"></input></p>';
        if(genero_infoConta=="Feminino"){
            html += '<p class="contentResponsiveFont">Gênero:<input type="radio" name="generoAlterado" value="Masculino" class="inputMargem"> Masculino <input class="inputMargem" type="radio" name="generoAlterado" checked value="Feminino"> Feminino</p>'
        }else if(genero_infoConta == "Masculino"){
            html += '<p class="contentResponsiveFont">Gênero:<input type="radio" name="generoAlterado" value="Masculino" checked class="inputMargem"> Masculino <input class="inputMargem" type="radio" name="generoAlterado" value="Feminino"> Feminino</p>'
        }else{
            html += '<p class="contentResponsiveFont">Gênero:<input type="radio" name="generoAlterado" value="Masculino" class="inputMargem"> Masculino <input class="inputMargem" type="radio" name="generoAlterado" value="Feminino"> Feminino</p>'
        }
        html += '<p class="contentResponsiveFont">Email Parental:<input name="emailAlterado" id="inputEmail" class="inputInfoPerfil inputMargem" placeholder="'+email_infoConta+'"></p>';
        html += '<p class="contentResponsiveFont">Contacto telefónico:<input name="telemovelAlterado" id="inputPhone" class="inputInfoPerfil inputMargem" placeholder="'+telemovel_infoConta+'"></input></p>';
        html += '<div class="alterarUserData flexboxStyle"><button type="submit" class="contentResponsiveFont boxInnerOutterShadow guardarInfo">Guardar</button><button class="contentResponsiveFont boxInnerOutterShadow">Voltar</button></div>';
        html += '</form></div></div></div></div>';
        // Footer
        html += fundo;
        // Fechar HTML
        html += acabarHtml;
        // Enviar HTML final para o cliente
        res.send(html);
    }else{
        var htmlForbiden = "<!DOCTYPE  html><html><head></head><body><h2>Error Code: 403</h2><br><p>Forbiden: Inicia sessão para poderes entrar em /conta </p></body></html>"
        res.status(403).send(htmlForbiden);
    }
    log(req.session.username, req.path);
});

servidor.post("/processaContaAlterar", logging, function (req, res) {
    var {nomeAlterado, idadeAlterado, generoAlterado, emailAlterado, telemovelAlterado} = req.body;
    //console.log(nomeAlterado, idadeAlterado, generoAlterado, emailAlterado, telemovelAlterado);
    const informacao = fs.readFileSync('LoginInformations.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        }
    });
    var DadosTotais =(JSON.parse(informacao));
    var OldData = DadosTotais[req.session.index];
    //console.log('------------------------------------------------------------')
    //console.log(OldData);
    var LoginCar = OldData
    if(nomeAlterado){
        LoginCar["nome"] = nomeAlterado;
    }
    if(idadeAlterado){
        LoginCar["idade"] = idadeAlterado;
    }
    if(generoAlterado){
        LoginCar["genero"] = generoAlterado;
    }
    if(emailAlterado){
        LoginCar["email"] = emailAlterado;
    }
    if(telemovelAlterado){
        LoginCar["telemovel"] = telemovelAlterado;
    }
    //console.log('------------------------------------------------------------')
    //console.log(LoginCar);
    var logins = [];
    fs.readFile('LoginInformations.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            if (data){
                logins_JSON = JSON.parse(data);
                for(var i in logins_JSON){
                    logins.push(logins_JSON[i]);
                }
                //console.log('------------------------LOGINS OLD------------------------------------')
                //console.log(logins);
                logins[req.session.index] = LoginCar;
                //console.log('--------------------------LOGINS----------------------------------')
                //console.log(logins);
                json = JSON.stringify(logins);
                //console.log(json);
                fs.writeFile('LoginInformations.json', json, 'utf8', function (err) {
                    if (err) {
                        console.error("erro ao guardar os dados no servidor");
                        res.send("Erro ao guardar os dados no servidor<br><a href='/'>Voltar à Pagina inicial</a> ")
                    }
                    else {
                        //console.log("Dados guardados com sucesso no servidor");
                        res.redirect("/conta");
                    };
                });
            }
        }
    });
    log(req.session.username, req.path)
    }
);

servidor.get("/favoritos", logging, function (req, res) {

    // Tentar abrir ficheiro
    try {
        var favoritos_content = fs.readFileSync('Favoritos.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Favoritos | Viajar com Livros </title>';
    // Css único da página
    html += '<link type="text/css" rel="stylesheet" href="/css/favoritos.css">';
    html += '<link type="text/css" rel="stylesheet" href="/css/areaLeitor.css">';
    // JavaScript para dados de Sessões de Livros
    html += '<script src="/javascript/CalendarioMetadata.js"></script>';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/processaTerminoSessao" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Terminar Sessão</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';

    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += favoritos_content;
    if (req.session.index) {
        
        html += '<div class="imgBackgroundPerfilFav"><div class="imgPerfilFav"><img src="/Imagens/AreaDoLeitor/fotoPerfil.png">';
        // Alterar apresentação do nome
        html += '<p class="nomePerfilFav">'+req.session.username+'</p></div></div>';
        html += '</div><div class="horizontalLine"><p class="livrosFavoritos">Favoritos</p><div class="favoritos"><div class="favoritosGrid">';

        const InfoLivrosSessoes = fs.readFileSync('Livros&Sessoes.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            }
        });

        const InfoContas = fs.readFileSync('LoginInformations.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            }
        });

        var InfoLivroSessoes_json =(JSON.parse(InfoLivrosSessoes));
        var InfoContas_json =(JSON.parse(InfoContas));
        var Livros = InfoLivroSessoes_json.Livros;
        var Favoritos;

        //console.log("---------------------------Livros------------------------------")
        //console.log(Livros);

        //console.log("---------------------------Favoritos------------------------------")
        //console.log(InfoContas_json[req.session.index].Favoritos);

        if (req.session.index) {
            Favoritos = InfoContas_json[req.session.index].Favoritos;
            
            var val_temp = Object.values(Livros);
            
            for (var i = 0; i < Favoritos.length; i++) {
                var fav_temp = Favoritos[i].toString();
                // Bloco HTML Livro
                html += '<div class="bookSection"><div class="bookImageSection"><a href="#"><img class="bookImg" src="/Imagens/Calendário/Livro_'+fav_temp+'.jpg"></a></div><div class="bookName">'+ Livros[parseInt(fav_temp)-1]+'</div></div>';

            }
        }else{
            html += '<h2>Pára de ser burro! Inicia sessão</h2>'
        }

        html += '</div></div></div></div></div>';
        // Fechar DIV WRAPPER
        html += '</div>'; 
        // Footer
        html += fundo;
        // Fechar HTML
        html += acabarHtml;
        // Enviar HTML final para o cliente
        res.send(html);
        
    }else{
        var htmlForbiden = "<!DOCTYPE  html><html><head></head><body><h2>Error Code: 403</h2><br><p>Forbiden: Inicia sessão para poderes entrar em /conta </p></body></html>"
        res.status(403).send(htmlForbiden);
    }
    log(req.session.username, req.path);
});

servidor.get("/amigos", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var amigos_content = fs.readFileSync('Amigos.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Amigos | Viajar com Livros </title>';
    html += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>';
    // Css único da página
    html += '<link type="text/css" rel="stylesheet" href="/css/areaLeitor.css">';
    html += '<link type="text/css" rel="stylesheet" href="/css/amigo.css">';
    // JavaScript único para animações
    html += '<script src="/javascript/amigos.js" defer></script>';
    // JavaScript para dados de Sessões de Livros
    html += '<script src="/javascript/CalendarioMetadata.js"></script>';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/processaTerminoSessao" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Terminar Sessão</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += amigos_content;

    if (req.session.index) {
        // Fechar DIV WRAPPER
        html += '</div>'; 
        // Footer
        html += fundo;
        // Fechar HTML
        html += acabarHtml;
        // Enviar HTML final para o cliente
        res.send(html);
    }else{
        var htmlForbiden = "<!DOCTYPE  html><html><head></head><body><h2>Error Code: 403</h2><br><p>Forbiden: Inicia sessão para poderes entrar em /conta </p></body></html>"
        res.status(403).send(htmlForbiden);
    }
    log(req.session.username, req.path);
});

servidor.get("/comentarios", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var comentarios_content = fs.readFileSync('comentarios.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Comentários | Viajar com Livros </title>';
    html += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>';
    // Css único da página
    html += '<link type="text/css" rel="stylesheet" href="/css/areaLeitor.css">';
    html += '<link type="text/css" rel="stylesheet" href="/css/amigo.css">';
    html += '<link type="text/css" rel="stylesheet" href="/css/comentarios.css">';
    // JavaScript para dados de Sessões de Livros
    html += '<script src="/javascript/CalendarioMetadata.js"></script>';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/processaTerminoSessao" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Terminar Sessão</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += comentarios_content;

    const informacao = fs.readFileSync('LoginInformations.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        }
        
    });
    var DadosTotais =(JSON.parse(informacao));
    var CommentsFeitos;
    if (req.session.index) {
        CommentsFeitos = DadosTotais[req.session.index].Comentarios;
        // //console.log("User Data: ",  DadosTotais[req.session.index]);
        // //console.log("Coments do User: ", CommentsFeitos);
        
        
        for (var i = 0; i < CommentsFeitos.length; i++) {
            var comentarioEscolhido = "comentario"+ i;
            // //console.log("Comentário: ", comentarioEscolhido);
            // //console.log(CommentsFeitos[i]);
            // //console.log(CommentsFeitos[i].LivroComment);
            // //console.log(CommentsFeitos[i].DataComment);
            // //console.log(CommentsFeitos[i].Comentario);
            html += '<div class="comentario" id="comentario'+ i +'"><div class="comentarioInfo"><div class="dadosComentario"><p class="nomeLivro">' 
            + CommentsFeitos[i].LivroComment + '</p><p class="dataComentario">' + CommentsFeitos[i].DataComment 
            + '</p></div><div class="opcoesComentario"><div class="editComent ComentSize"><img src="/Imagens/Icons/edit.svg" alt="Editar Comentário" onclick="editarComentario('+"'" 
            + comentarioEscolhido + "'" + ')"></div><div class="deleteComent ComentSize"><img src="/Imagens/Icons/lixo.svg" alt=""></div></div></div><div class="comentarioContent"><p>' 
            + CommentsFeitos[i].Comentario + '</p></div></div>';
        }
    }else{
        html += '<h2>Pára de ser burro! Inicia sessão</h2>'
    }
        
    
   //FIM Conteudo Area Leitor 
    html += '</div></div>';
    //FIM de Conteudo

    // Fechar DIV WRAPPER
    html += '</div>'; 
    html += '<script>function editarComentario(id){//console.log(id);//console.log(document.getElementById(id));document.getElementById('+"'" + "id" + "'"+').innerHTML = "";}</script>';
    if (req.session.index) {
        // Footer
        html += fundo;
        // Fechar HTML
        html += acabarHtml;
        // Enviar HTML final para o cliente
        res.send(html);
        //log(req.session.username, req.path)
    }else{
        var htmlForbiden = "<!DOCTYPE  html><html><head></head><body><h2>Error Code: 403</h2><br><p>Forbiden: Inicia sessão para poderes entrar em /conta </p></body></html>"
        res.status(403).send(htmlForbiden);
    }
    log(req.session.username, req.path);
});

servidor.post("/processaComentario", logging, function (req, res) {
    // Tentar abrir ficheiro
    
    res.send('Processa Comentário');

    log(req.session.username, req.path);
});

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

servidor.get("/historico", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var historico_content = fs.readFileSync('Historico.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Histórico | Viajar com Livros </title>';
    html += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>';
    // Css único da página
    html += '<link type="text/css" rel="stylesheet" href="/css/historico.css">';
    html += '<script src="/javascript/IniciarSessao.js"></script>';
    // JavaScript para dados de Sessões de Livros
    html += '<script src="/javascript/CalendarioMetadata.js"></script>';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/processaTerminoSessao" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Terminar Sessão</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += historico_content;
    if (req.session.index) {
        const InfoLivrosSessoes = fs.readFileSync('Livros&Sessoes.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            }
        });
    
        const InfoContas = fs.readFileSync('LoginInformations.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            }
        });
    
        var InfoLivroSessoes_json =(JSON.parse(InfoLivrosSessoes));
        var InfoContas_json =(JSON.parse(InfoContas));
        var Sessoes = InfoLivroSessoes_json.Sessoes;

        // Criação de data juntamente com horario para organização em timeline de forma ordenada
        for (livro of Sessoes){
            var hora = "0"
            if (String(livro.hora).length == 1){
                hora += String(livro.hora);
            }else{
                hora = String(livro.hora);
            }
            var data = String(livro.data)
            var minuto = String(livro.minuto)
            livro.dataCompleta = data + "-" + hora + ":" + minuto
            //console.log(livro);
        }

        // Oraanizar sessões por data Crescente
        Sessoes.sort(function (a, b) {
            if (a.dataCompleta < b.dataCompleta) {
                // passar livro a frente um index
                return 1;
            }
            if (a.dataCompleta > b.dataCompleta) {
                // recuar livro um valor no index
                return -1;
            }
            // continuar na mesma posição
            return 0;
        });
    
        //console.log("---------------------------Livros------------------------------")
        //console.log(Sessoes);
    
        //console.log("---------------------------Favoritos------------------------------")
        //console.log(InfoContas_json[req.session.index].Agenda);
        for (let i = 0; i < Sessoes.length; i++) {
            var session = Sessoes[i];
            var id =  session.session_ID;
            if (InfoContas_json[req.session.index].Agenda.includes(id)){
                //console.log(session);
                // Bloco HTML Livro
                html += '<div class="livroSection"><div class="livro"><a href="#"><div class="bookHistoricoImg">';
            
                // Alterar Imagem do livro respetivamente
                html += '<img src="/Imagens/Calendário/Livro_'+session.ref+'.jpg">';
            
                html += '</div><div class="bookHistoricoContent"><div class="bookHistoricoTitle">';
            
                //Alterar Nome do Livro da sessao
                html += '<h3>'+session.livro+'</h2>';
            
                html += '</div><div class="bookHistoricoSessionInfo"><div class="infoLine"><p class="strong">Data:</p>';
            
                //Alterar a Data da sessão
                html += '<p>'+ reverse(session.data)+'</p>';
            
                html += '</div><div class="infoLine"><p class="strong">Hora:</p>';
            
                //Alterar a Hora da Sessão
                html += '<p>'+session.hora+'</p>';
            
                html += '</div><div class="infoLine"><p class="strong">Duração:</p>';
            
                // Alterar Duração da sessão
                html += '<p>'+session.duração+'</p>';
            
                html += '</div><div class="infoLine"><p class="strong">Orador:</p>';
            
                //Alterar Nome do Orador da Sessão
                html += '<p>'+session.orador+'</p>';
            
                html += '</div></div></div></a></div></div>';
            };
        };
    
                                                        
    
        html += '</div></div><!-- FIM Conteudo Area Leitor --></div></div><!--FIM de Conteudo--></div>';
        // Fechar DIV WRAPPER
        html += '</div>'; 
        // Footer
        html += fundo;
        // Fechar HTML
        html += acabarHtml;
        // Enviar HTML final para o cliente
        res.send(html);
        //log(req.session.username, req.path)
    }else{
        var htmlForbiden = "<!DOCTYPE  html><html><head></head><body><h2>Error Code: 403</h2><br><p>Forbiden: Inicia sessão para poderes entrar em /conta </p></body></html>"
        res.status(403).send(htmlForbiden);
    }
    log(req.session.username, req.path);
});

servidor.get("/calendarioPessoal", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var calendárioPessoal_content = fs.readFileSync('CalendárioPessoal.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Informações de Conta | Viajar com Livros </title>';
    // Css único da página
    html += '<link type="text/css" rel="stylesheet" href="/css/infoConta.css">';
    html += '<link type="text/css" rel="stylesheet" href="/css/areaLeitor.css">';
    html += '<link type="text/css" rel="stylesheet" href="/css/CalendárioPessoal.css">';
    html += '<link type="text/css" rel="stylesheet" href="/css/evo-calendar.min.css">';
    html += '<link type="text/css" rel="stylesheet" href="/css/evo-calendar.royal-navy.min.css">';
    html += '<link type="text/css" rel="stylesheet" href="/css/demo.css">';

    // JavaScript para dados de Sessões de Livros
    html += '<script src="/javascript/CalendarioMetadata.js"></script>';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/processaTerminoSessao" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Terminar Sessão</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += calendárioPessoal_content;
    html += '<script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>';
    html += '<script src="/javascript/evo-calendar.js"></script>';
    html += '<script src="/javascript/demo.js"></script>';
    if (req.session.index) {
        // Fechar DIV WRAPPER
        html += '</div>'; 
        // Footer
        html += fundo;
        // Fechar HTML
        html += acabarHtml;
        // Enviar HTML final para o cliente
        res.send(html);
        //log(req.session.username, req.path)
    }else{
        var htmlForbiden = "<!DOCTYPE  html><html><head></head><body><h2>Error Code: 403</h2><br><p>Forbiden: Inicia sessão para poderes entrar em /conta </p></body></html>"
        res.status(403).send(htmlForbiden);
    }
    log(req.session.username, req.path);
});

servidor.get("/ajuda", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var ajuda_content = fs.readFileSync('Ajuda.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Ajuda | Viajar com Livros </title>';
    // Css único da página
    html += '<link type="text/css" rel="stylesheet" href="/css/ajuda.css">';
    html += '<link type="text/css" rel="stylesheet" href="/css/areaLeitor.css">';
    html += '<script src="/javascript/Ajuda.js" defer></script>';

    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += '<div id=ghost></div>'
    html += ajuda_content;
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);
    log(req.session.username, req.path);
});

servidor.get("/forminscricao", logging, function (req, res) {
    // Tentar abrir ficheiro
    try {
        var form_inscricao_content = fs.readFileSync('forminscricao.html', 'utf-8');
    }
    // Caso nao consiga da log do erro
    catch (error){
        console.error("Erro ao ler ficheiros de conteudo.")
        console.error(error)
    }
    // Apresentação do Site
    var html = "";
    html += iniciarHtml;
    // Abrir <head> tag
    html += head;
    // Titulo da página
    html += '<title> Formulário de inscrição | Viajar com Livros </title>';
    // Css único da página
    html += '<link rel="stylesheet" type="text/css" href="css/inscricao.css">';
    html += '<link rel="stylesheet" type="text/css" href="css/structure.css">';
    html += '<link rel="stylesheet" type="text/css" href="css/areaLeitor.css">';
    // Finalizar <head> tag
    html += acabarHead;
    // div wrapper 
    html += '<div id="wrapper">';
    // Abrir Navbar
    html += topo;
    // Verificação de inicio de sessão para saber se vai fazer login ou vai para a Area de Utilizador
    if (req.session.username) {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick=session_abrir("iniciarSessaoPopUp")>';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    }
    // HTML icone para NavBar responsiva
    html += '</a><a href="javascript:void(0);" class="icon" onclick="myFunction()">&#9776;</a></div></header></div>';
    // HTML relativo a Login e Registo
    //html += loginRegist;
    // Conteudo da pagina
    html += form_inscricao_content;
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);
    log(req.session.username, req.path);
});

servidor.post("/InscRealizada", logging, function (req, res) {
    //colocar referencia de sessão
    var {nomeForm, emailForm, tlmForm, receiveEmail} = req.body;
    if (receiveEmail == "on") {
        receiveEmail = true;
    }else{
        receiveEmail = false;
    }
    var formInsc = {"nome": nomeForm, "email" : emailForm, "Contacto" : tlmForm, "Receber Email": receiveEmail};
    var FormInscFinal = [];

    fs.readFile('InscreveForm.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            if (data){
                inscricao_JSON = JSON.parse(data);
                for(var i in inscricao_JSON){
                    FormInscFinal.push(inscricao_JSON[i]);
                }
                //console.log(FormInscFinal);
                // Escrever tudo de novo no JSON
                FormInscFinal.push(formInsc);
                //console.log(formInsc);
                json = JSON.stringify(FormInscFinal);
                //console.log(json);
                fs.writeFile('InscreveForm.json', json, 'utf8', function (err) {
                    if (err) {
                        console.error("erro ao guardar os dados no servidor");
                        res.send("erro ao guardar os dados no servidor<br><a href='/'>Voltar à Pagina inicial</a> ")
                    }
                    else {
                        //console.log("Dados guardados com sucesso no servidor");
                        res.send("Sessão registada com sucesso. <br><a href='/'>Voltar à Pagina inicial</a> ")
                    };
                });
            }else{
                FormInscFinal.push(formInsc);
                //console.log(formInsc);
                json = JSON.stringify(FormInscFinal);
                //console.log(json);
                fs.writeFile('InscreveForm.json', json, 'utf8', function (err) {
                    if (err) {
                        console.error("erro ao guardar os dados no servidor");
                        res.send("erro ao guardar os dados no servidor<br><a href='/'>Voltar à Pagina inicial</a> ")
                    }
                    else {
                        //console.log("Dados guardados com sucesso no servidor");
                        res.send("Sessão registada com sucesso. <br><a href='/'>Voltar à Pagina inicial</a> ")
                    };
                });
            }
        }
    });
    log(req.session.username, req.path);

})

// Processar o form Newsletter para JSON
servidor.post('/processa_newsletter', function (req, res) {
    const {email} = req.body;
    var emails = [];
    // Ler ficheiro atual JSON
    fs.readFile('Newsletter_Emails.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            emails_JSON = JSON.parse(data);
            for(var i in emails_JSON){
                emails.push(emails_JSON[i]);
            }
            if (emails.includes(email)){
                //console.log("O email inserido já foi enviado anteriormente")
                res.send("O email inserido já foi enviado anteriormente");
            }else{
                emails.push(email);
                // Escrever tudo de novo no JSON
                json = JSON.stringify(Object.assign({}, emails));
                //console.log(json);
                fs.writeFile('Newsletter_Emails.json', json, 'utf8', function (err) {
                    if (err) {
                        console.error("erro ao guardar os dados no servidor");
                        res.send("erro ao guardar os dados no servidor");
                    }
                    else {
                        //console.log("Dados guardados com sucesso no servidor");
                        res.send("Dados guardados com sucesso no servidor");
                    };
                });
            }
        }
    });
    log(req.session.username, req.path);
});

// função para logging
function log(username, caminho) {
    if (username == null) {
        username = "anónimo";
    }
    var log = username + "; " + caminho + "; " + new Date().toString() + "\n";
    try {
        fs.appendFileSync("log.txt", log);
    }
    catch (error) {
        console.error("erro ao registar entrada no log");
    }
}