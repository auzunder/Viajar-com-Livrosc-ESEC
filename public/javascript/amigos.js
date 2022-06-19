var myArray = [
    {'name':'Ana Santos', 'age':'13'},
    {'name':'André Filó', 'age':'15'},
    {'name':'Carolina Sintra', 'age':'15'},
    {'name':'Filipa Loureiro', 'age':'15'},
    {'name':'Francisco Rebelo', 'age':'13'},
    {'name':'João Tomás', 'age':'14'},
    {'name':'Jorge Silva', 'age':'14'},
    {'name':'Laura Sousa', 'age':'12'},
    {'name':'Leonor Almeida', 'age':'14'},
    {'name':'Luísa Santos', 'age':'12'},
    {'name':'Ricardo Cruz', 'age':'14'},
    {'name':'Rita Mortágua', 'age':'15'},
]



$('#search-input').on('keyup', function(){
    var value = $(this).val()
    console.log('Value:', value);

    var data = searchTable(value, myArray)
     buildTable(data)
})

buildTable(myArray)


function searchTable(value,data) {

    var filteredData = []

    for (var i = 0; i < data.length; i++) {
        value = value.toLowerCase()
        var name = data[i].name.toLowerCase()
        
        if (name.includes(value)) {
            filteredData.push(data[i])
        }
    }
    return filteredData;
    
}

 $('th').on('click', function(){
     var column = $(this).data('colname')
     var order = $(this).data('order')
     var text = $(this).html()
     text = text.substring(0, text.length - 1);
     
     
     

    $(this).html(text)
    buildTable(myArray)
    })


   
 
    
function buildTable(data){
    var table = document.getElementById('myTable')
    table.innerHTML = ''
    for (var i = 0; i < data.length; i++){
        var colname = `name-${i}`

        var row = `<div class="amigosContent">
                        <img src="/Imagens/AreaDoLeitor/fotoPerfil.png" class="imgAmigo" alt="Foto Perfil">
                        <div class="amigosInfo">
                            <p class="nomeAmigo">${data[i].name}</p>
                            <p class="idadeAmigo">${data[i].age} anos</p>
                        </div>
                   </div>`
        table.innerHTML += row
    }
}
