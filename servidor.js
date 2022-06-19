const session = require('express-session');
const express = require('express');
const sha1 = require('sha1');
const fs = require('fs');

const servidor = express();
var porta = 8080;

servidor.use(express.urlencoded({
    extended: true
}));

servidor.use(express.static("public"));

//Sessão
servidor.use(session({
    secret: "supercalifragilisticexpialidocious",
    resave: false,
    saveUninitialized: true
}));

servidor.listen(porta, function () {
    console.log("servidor a ser executado em http://localhost://" + porta);
});

// Leitura de HTML repetido
try{
    var topo = fs.readFileSync('NavBar.html', 'utf-8');
    var fundo = fs.readFileSync('Footer.html', 'utf-8');
}
catch (error){
    console.error("Erro ao ler ficheiros de NarBar ou Footer.")
    console.error(error)
}

const iniciarHtml = '<!DOCTYPE html><html><head>';
const acabarHead = '</head><body>'
const acabarHtml = '</body></html>'
var head = fs.readFileSync('head.html', 'utf-8');

var sobre_nos_content = fs.readFileSync('SobreOProjeto.html', 'utf-8');
var calendario_content = fs.readFileSync('Calendario.html', 'utf-8');
var biblioteca_content = fs.readFileSync('Biblioteca.html', 'utf-8');
var galeria_foto_content = fs.readFileSync('Fotografias.html', 'utf-8');
var galeria_video_content = fs.readFileSync('videos.html', 'utf-8');
var noticias_content = fs.readFileSync('Noticias/Noticias.html', 'utf-8');
var voluntariado_content = fs.readFileSync('forms.html', 'utf-8');
var voluntariado2_content = fs.readFileSync('forms2.html', 'utf-8');
var voluntariado3_content = fs.readFileSync('forms3.html', 'utf-8');
var conta_content = fs.readFileSync('InformaçoesDeConta.html', 'utf-8');

servidor.get("/", function (req, res) {
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
    // JavaScript único para animações
    html += '<script src="/javascript/lottie.js"></script>';
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
        html += '<a href="/AreaDoLeitor/area_do_utilizador" id="areaLeitorAnchor">';
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

    //log(req.session.username, req.path);
});


servidor.get("/sobre_nos", function(req, res) {
    var html = "";
    html += topo;
    html += sobre_nos_content;
    html += fundo;
    res.send(html);
})

servidor.get("/calendario", function(req, res) {
    var html = "";
    html += topo;
    html += calendario_content;
    html += fundo;
    res.send(html);
})

servidor.get("/biblioteca", function(req, res) {
    var html = "";
    html += topo;
    html += biblioteca_content;
    html += fundo;
    res.send(html);
})

servidor.get("/fotografias", function(req, res) {
    var html = "";
    html += topo;
    html += galeria_foto_content;
    html += fundo;
    res.send(html);
})

servidor.get("/videos", function(req, res) {
    var html = "";
    html += topo;
    html += galeria_video_content;
    html += fundo;
    res.send(html);
})

servidor.get("/noticias", function(req, res) {
    var html = "";
    html += topo;
    html += noticias_content;
    html += fundo;
    res.send(html);
})

servidor.get("/voluntariado-1", function(req, res) {
    var html = "";
    html += topo;
    html += voluntariado_content;
    html += fundo;
    res.send(html);
})

servidor.get("/voluntariado-2", function(req, res) {
    var html = "";
    html += topo;
    html += voluntariado2_content;
    html += fundo;
    res.send(html);
})

servidor.get("/voluntariado-3", function(req, res) {
    var html = "";
    html += topo;
    html += voluntariado3_content;
    html += fundo;
    res.send(html);
})

servidor.get("/conta", function(req, res) {
    var html = "";
    html += topo;
    html += conta_content;
    html += fundo;
    res.send(html);
})


servidor.get("/favoritos", function (req, res) {
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
    // JavaScript único para animações
    html += '<script src="/javascript/lottie.js"></script>';
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
        html += '<a href="/AreaDoLeitor/area_do_utilizador" id="areaLeitorAnchor">';
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

servidor.get("/amigos", function (req, res) {
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
    html += '<script src="/javascript/lottie.js"></script>';
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
        html += '<a href="/AreaDoLeitor/area_do_utilizador" id="areaLeitorAnchor">';
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

servidor.get("/comentarios", function (req, res) {
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
    // JavaScript único para animações
    html += '<script src="/javascript/lottie.js"></script>';
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
        html += '<a href="/AreaDoLeitor/area_do_utilizador" id="areaLeitorAnchor">';
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

servidor.get("/historico", function(req, res) {
    var html = "";
    html += topo;
    html += 0;
    html += fundo;
    res.send(html);
})


servidor.get("/ajuda", function (req, res) {
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
        html += '<a href="/AreaDoLeitor/area_do_utilizador" id="areaLeitorAnchor">';
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

servidor.get('/newsletter_form', function (req, res) {
    var email = req.query.email;
    res.type('html');
    var html = "";
    html += topo;
    if (email) {
        html += 'email: ' + email + '<br>\n';
        var dados = email + ";";
        //experimentar com fs.writeFile() em vez de fs.appendFile()
        fs.appendFile('dados.txt', dados, function (err) {
            if (err) {
                console.error("erro ao guardar os dados no servidor");
            }
            else {
                console.log("dados guardados com sucesso no servidor");
            }
        });
    }
    else {
        html += '<p>por favor, preencha os dados todos</p>\n';
    }
    html += fundo;
    res.send(html);
});




/*

// quando é usado o método GET no formulário
servidor.get('/processaformulario', function (req, res) {
    var nome = req.query.nome;
    var dn = req.query.dn;
    var email = req.query.email;
    var telefone = req.query.telefone;
    var morada = req.query.morada;
    res.type('html');
    var html = "";
    html += topo;
    if (nome && dn && telefone && email && morada) {
        html += '<p>\n';
        html += 'nome: ' + nome + '<br>\n';
        html += 'dn: ' + dn + '<br>\n';
        html += 'telefone: ' + telefone + '<br>\n';
        html += 'email: ' + email + '<br>\n';
        html += 'morada: ' + morada + '<br>\n';
        html += '</p>\n';

        var dados = nome + ";" + dn + ";" + telefone + ";" + email + ";" + morada + "\n";
        //experimentar com fs.writeFile() em vez de fs.appendFile()
        fs.appendFile('dados.txt', dados, function (err) {
            if (err) {
                console.error("erro ao guardar os dados no servidor");
            }
            else {
                console.log("dados guardados com sucesso no servidor");
            }
        });
    }
    else {
        html += '<p>por favor, preencha os dados todos</p>\n';
    }
    html += fundo;
    res.send(html);
});

// quando é usado o método POST no formulário
servidor.post('/processaFormulario', function (req, res) {
    var nome = req.body.nome;
    var dn = req.body.dn;
    var email = req.body.email;
    var telefone = req.body.telefone;
    var morada = req.body.morada;
    res.type('html');
    var html = "";
    html += topo;
    if (nome && dn && telefone && email && morada) {
        html += '<p>\n';
        html += 'nome: ' + nome + '<br>\n';
        html += 'dn: ' + dn + '<br>\n';
        html += 'telefone: ' + telefone + '<br>\n';
        html += 'email: ' + email + '<br>\n';
        html += 'morada: ' + morada + '<br>\n';
        html += '</p>\n';

        var dados = nome + ";" + dn + ";" + telefone + ";" + email + ";" + morada + "\n";
        //experimentar com fs.writeFile() em vez de fs.appendFile()
        fs.appendFile('dados.txt', dados, function (err) {
            if (err) {
                console.error("erro ao guardar os dados no servidor");
            }
            else {
                console.log("dados guardados com sucesso no servidor");
            }
        });
    }
    else {
        html += '<p>por favor, preencha os dados todos</p>\n';
    }
    html += fundo;
    res.send(html);
});

servidor.get('/mostradados', function (req, res) {
    fs.readFile('./dados.txt', function (err, data) {
        if (err) {
            res.type('html');
            var html = "";
            html += topo;
            html += "<h1>ficheiro não encontrado</h1>\n";
            html += fundo;
            res.status(404).send(html);
        }
        else {
            res.type('html');
            var html = "";
            html += topo;
            html += "<h1>dados</h1>\n";
            html += '<p>\n';
            var linhas = data.toString().split('\n');
            for (var i = 0; i < linhas.length; i++) {
                html += linhas[i] + '<br>\n';
            }
            html += '</p>\n';
            html += fundo;
            res.send(html);
        }
    });
});

*/

