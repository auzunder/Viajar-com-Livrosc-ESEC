const session = require('express-session');
const express = require('express');
const sha1 = require('sha1');
const fs = require('fs');
const { send } = require('process');

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
const session_validate = (req, res, next) => {
    var anon = {
        nome : "anonimo",
        idade : 0,
        genero : "por Identificar",
        email : "exemplo@exemplo.com",
        contacto : "9XXXXXXXX"
    };
    if (!req.session.username){
        req.session.username = anon.nome;
        req.session.idade = anon.idade;
        req.session.genero = anon.genero;
        req.session.email = anon.email;
        req.session.contacto = anon.contacto;
    };
    console.log(req.session.username)
    next()
}

servidor.get("/", session_validate, function (req, res) {
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
    if (req.session.username != "anonimo") {
        // HTML do botão direcionado para a Conta (Caso tenha login feito)
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="#" id="areaLeitorAnchor" onclick='+'abrir("iniciarSessaoPopUp")>';
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

    console.log(req.session, req.session.username, req.path);
});

servidor.post("/Login", function (req, res) {
    var {email, password} = req.body;
    var loginCar = {"email" : email, "password" : sha1(password)};
    console.log(loginCar);
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
                    }
                    logins.push(logins_JSON[i]);
                }
                console.log(logins);
                if (emails.includes(loginCar.email)){
                    console.log("O email inserido já foi registado anteriormente");
                    if (loginCar.password == logins[index].password){
                        console.log("O email e password foram digitados corretamente");
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
                        console.log("Password não digitada corretamente.");
                        res.send("Password não digitada corretamente.<br><a href='/'>Voltar à Pagina inicial</a> ")
                    }
                }else{
                    console.log("Utilizador nao registado");
                    res.send("Utilizador nao registado<br><a href='/'>Voltar à Pagina inicial</a> ")
                }
            }
        }
    });
})

servidor.post("/Registo", function (req, res) {
    var {nomeRegisto, emailRegisto, passwordRegisto} = req.body;
    var loginCar = {"nome": nomeRegisto, "email" : emailRegisto, "password" : sha1(passwordRegisto)};
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
                console.log(logins);
                if (emails.includes(loginCar.email)){
                    console.log("O email inserido já foi registado anteriormente")
                    res.send("O email inserido já foi registado anteriormente<br><a href='/'>Voltar à Pagina inicial</a> ")
                }else{
                    // Escrever tudo de novo no JSON
                    logins.push(loginCar);
                    console.log(loginCar);
                    json = JSON.stringify(logins);
                    console.log(json);
                    fs.writeFile('LoginInformations.json', json, 'utf8', function (err) {
                        if (err) {
                            console.error("erro ao guardar os dados no servidor");
                            res.send("erro ao guardar os dados no servidor<br><a href='/'>Voltar à Pagina inicial</a> ")
                        }
                        else {
                            console.log("Dados guardados com sucesso no servidor");
                            res.send("Utilizador Registado com sucesso. Para continuar, faça o login.<br><a href='/'>Voltar à Pagina inicial</a> ")
                        };
                    });
                }
            }else{
                logins.push(loginCar);
                console.log(loginCar);
                json = JSON.stringify(logins);
                console.log(json);
                fs.writeFile('LoginInformations.json', json, 'utf8', function (err) {
                    if (err) {
                        console.error("erro ao guardar os dados no servidor");
                        res.send("erro ao guardar os dados no servidor<br><a href='/'>Voltar à Pagina inicial</a> ")
                    }
                    else {
                        console.log("Dados guardados com sucesso no servidor");
                        res.send("Utilizador Registado com sucesso. Para continuar, faça o login.<br><a href='/'>Voltar à Pagina inicial</a> ")
                    };
                });
            }
        }
    });

})

servidor.get("/sobre_nos", session_validate, function (req, res) {
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
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
})

servidor.get("/calendario", session_validate, function (req, res) {
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
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
})

servidor.get("/biblioteca", session_validate, function (req, res) {
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
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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

})

servidor.get("/fotografias", session_validate, function (req, res) {
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
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
})

servidor.get("/videos", session_validate, function (req, res) {
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
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
})

servidor.get("/noticias", session_validate, function (req, res) {
   
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
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
})

servidor.get("/voluntariado_Page1", session_validate, function (req, res) {
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
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
})

servidor.get("/voluntariado_Page2", session_validate, function (req, res) {
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
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
})

servidor.get("/voluntariado_Page3", session_validate, function (req, res) {
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
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
})

servidor.get("/conta", session_validate, function (req, res) {
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
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);

    //log(req.session.username, req.path);
});

servidor.get("/favoritos", session_validate, function (req, res) {
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
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);

    //log(req.session.username, req.path);
});

servidor.get("/amigos", session_validate, function (req, res) {
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
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);

    //log(req.session.username, req.path);
});

servidor.get("/comentarios", session_validate, function (req, res) {
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
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);

    //log(req.session.username, req.path);
});

servidor.get("/historico", session_validate, function (req, res) {
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
        html += '<a href="/conta" id="areaLeitorAnchor">';
        html += '<div id="areaLeitor" class="boxInnerOutterShadow pointer responsiveHeight">';
        html += '<div id="leitorText">Area do Leitor</div>';
        html += '<img id="leitorIcon" src="/Imagens/Icons/AreaLeitor.svg">';
        html += '</div>';
    } 
    // HTML do botão direcionado para a Inicio de sessão (Caso seja utilizador anónimo)
    else{
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);

    //log(req.session.username, req.path);
});

servidor.get("/calendarioPessoal", session_validate, function (req, res) {
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
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
    // Fechar DIV WRAPPER
    html += '</div>'; 
    // Footer
    html += fundo;
    // Fechar HTML
    html += acabarHtml;
    // Enviar HTML final para o cliente
    res.send(html);

    console.log(req.session.username, req.path);
});

servidor.get("/ajuda", session_validate, function (req, res) {
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
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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

    //log(req.session.username, req.path);
});

servidor.get("/forminscricao", session_validate, function (req, res) {
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
        html += '<a href="/AreaDoLeitor/login" id="areaLeitorAnchor">';
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
});

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
                console.log("O email inserido já foi enviado anteriormente")
                res.send("O email inserido já foi enviado anteriormente");
            }else{
                emails.push(email);
                // Escrever tudo de novo no JSON
                json = JSON.stringify(Object.assign({}, emails));
                console.log(json);
                fs.writeFile('Newsletter_Emails.json', json, 'utf8', function (err) {
                    if (err) {
                        console.error("erro ao guardar os dados no servidor");
                        res.send("erro ao guardar os dados no servidor");
                    }
                    else {
                        console.log("Dados guardados com sucesso no servidor");
                        res.send("Dados guardados com sucesso no servidor");
                    };
                });
            }
            console.log(emails.includes(email));
        }
    });
});