const express = require('express');
const fs = require('fs');

const servidor = express();
var porto = 8080;

servidor.use(express.urlencoded({
    extended: true
}));

servidor.use(express.static("public"));

servidor.listen(porto, function () {
    console.log("servidor a ser executado em http://localhost://" + porto);
});

// tpc: carregar os ficheiros topo.html e fundo.html e guardá-los nas variáveis topo e fundo, respectivamente,
// investigando os métodos fs.readFileSync e fs.appendFileSync
// nota: não esquecer de instalar o módulo express na pasta onde estiver o servidor: npm install express

var topo = fs.readFileSync('NavBar.html', 'utf-8');
var fundo = fs.readFileSync('Footer.html', 'utf-8');
var home_content = fs.readFileSync('Home.html', 'utf-8');
var sobre_nos_content = fs.readFileSync('SobreOProjeto.html', 'utf-8');
var calendario_content = fs.readFileSync('Calendario.html', 'utf-8');
var biblioteca_content = fs.readFileSync('Biblioteca.html', 'utf-8');

servidor.get("/", function (req, res) {
    var html = "";
    html += topo;
    html += home_content;
    html += fundo;
    res.send(html);
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

servidor.get("/sobre_nos", function(req, res) {
    var html = "";
    html += topo;
    html += sobre_nos_content;
    html += fundo;
    res.send(html);
})

servidor.get("/sobre_nos", function(req, res) {
    var html = "";
    html += topo;
    html += sobre_nos_content;
    html += fundo;
    res.send(html);
})

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

