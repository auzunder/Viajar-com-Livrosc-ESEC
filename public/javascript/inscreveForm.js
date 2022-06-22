

servidor.post("/InscRealizada", function (req, res) {
            var {nomeForm, emailForm, tlmForm} = req.body;
            var formInsc = {"nome": nomeForm, "email" : emailForm, "Contacto" : tlmForm};
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
                        console.log(FormInscFinal);
                        // Escrever tudo de novo no JSON
                        FormInscFinal.push(formInsc);
                        console.log(formInsc);
                        json = JSON.stringify(FormInscFinal);
                        console.log(json);
                        fs.writeFile('InscreveForm.json', json, 'utf8', function (err) {
                            if (err) {
                                console.error("erro ao guardar os dados no servidor");
                                res.send("erro ao guardar os dados no servidor<br><a href='/'>Voltar à Pagina inicial</a> ")
                            }
                            else {
                                console.log("Dados guardados com sucesso no servidor");
                                res.send("Sessão registada com sucesso. <br><a href='/'>Voltar à Pagina inicial</a> ")
                            };
                        });
                    }else{
                        FormInscFinal.push(formInsc);
                        console.log(formInsc);
                        json = JSON.stringify(FormInscFinal);
                        console.log(json);
                        fs.writeFile('InscreveForm.json', json, 'utf8', function (err) {
                            if (err) {
                                console.error("erro ao guardar os dados no servidor");
                                res.send("erro ao guardar os dados no servidor<br><a href='/'>Voltar à Pagina inicial</a> ")
                            }
                            else {
                                console.log("Dados guardados com sucesso no servidor");
                                res.send("Sessão registada com sucesso. <br><a href='/'>Voltar à Pagina inicial</a> ")
                            };
                        });
                    }
                }
            });
        
        })