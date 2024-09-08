//variavel para guardar arquivo selecionado
const input = document.querySelector('#dados')
//variavel string para guardar os dados em forma de texto do arquivo csv
var dados;
//variavel com todas aslinhas guardadas em arrays diferentes
var array_dados = [];
//array que contem o id de todas as cells
var array_cells = []
//botao de salvar
var salvar = document.createElement('input')
salvar.type = 'button'
salvar.value = 'Salvar'
salvar.style.display = 'none'
salvar.classList.add('hov')
salvar.onclick = SalvarConteudo
var numero_de_colunas = 0
//acionar evento quando o estado do leitor de arquivo mudar
input.addEventListener('change',function(){
    //selecionar o primeiro arquivo e guardar na variavel
    const arquivos = this.files[0]
    //instanciar um leitor para esse arquivo
    const reader = new FileReader()

    //adicionar um evento ao leitor para quando o arquivo for carregado
    reader.addEventListener('load',function(){
        //guardar a leitura desse arquivo na variavel string
        dados = reader.result
        //chamar função e passar a variavel string como parametro para que os dados retornem como um array
        array_dados = Csv_reader(dados)
        const body = document.querySelector("body")
        body.appendChild(CriarTb(array_dados))
        document.querySelector('body').appendChild(salvar)
        
    })
    //ler os dados como texto
    reader.readAsText(arquivos)
})
//função que pega os dados em forma de texto e faz a analise lexa para dividir os dados e guardar cada "celula" em um array
function Csv_reader(data){
    //array que contera todas as celulas
    var linhas = []
    var linhas_totais = []
    //variavel que marca o inicio do dado
    var inicio_palavra= 0
    var string = '';
    var primeira_linha = true
    //laço for para percorrer todos os caracteres da string data que foi passada no parametro da função
    for (var fim_palavra = 0; fim_palavra<= data.length;fim_palavra++){
        //condição para encontrar as quebras de linhas que ficam no arquivo CSV e nao lelas como dados
        if (data[fim_palavra] === '\r'){

            //laço for que percorre a string até a virgula e guarda ela na variavel string
            for (inicio_palavra; inicio_palavra<fim_palavra;inicio_palavra++){
                
                string = string+data[inicio_palavra]
            }
            //guardando a variavel string em um array, linpando a variavel string e selecionando o final do dado como inicio do proximo e colocando em um array separado por linhas
            linhas.push(string)
            linhas_totais.push(linhas)
            linhas = []
            string = ''
            //pular o \r e o \n por isso numero é dois
            inicio_palavra+= 2
            primeira_linha = false
        }
        //condição para encontrar a virgula que separa os dados
        if (data[fim_palavra] == ',' ){

            //laço for que percorre a string até a virgula e guarda ela na variavel string
            for (inicio_palavra; inicio_palavra<fim_palavra ;inicio_palavra++){
                
                string = string+data[inicio_palavra]
            }
            //guardando a variavel string em um array, linpando a variavel string e selecionando o final do dado como inicio do proximo
            linhas.push(string)
            string = ''
            inicio_palavra++
            if (primeira_linha == true){
                numero_de_colunas++
            }
            
        }
        //condição que identifica se está na ultima lina e guarda o ultimo valor por conta de nao haver virgula
        if (typeof dados[fim_palavra] == "undefined"){
            for (inicio_palavra; inicio_palavra<fim_palavra ;inicio_palavra++){
                string = string+data[inicio_palavra]
                

            }
            //guardando a variavel string em um array, linpando a variavel string e selecionando o final do dado como inicio do proximo e colocando em um array separado por linhas
            linhas.push(string)
            linhas_totais.push(linhas)
            linhas = []
            string = ''
            inicio_palavra++
            if (primeira_linha == true){
                numero_de_colunas++
            }
        }
        
        
        
   }
   
    return linhas_totais
}
//função que cria a tabela e tem como parametro o array de linhas do CSV
function CriarTb(table_data){
    //cria a tabela
    const table = document.createElement('table')
    table.id = 'table'
    //laço for para percorrer cada array que equivale a uma row
    for(var table_row = 0; table_row<table_data.length;table_row++){
       //pegar cabeçalho
       if (table_row == 0){
        var tb_tr = document.createElement('tr')
        tb_tr.id = `tr${table_row}`
        //percorrer cada elemento do array do array
        for (var table_collum = 0;table_collum<table_data[table_row].length;table_collum++){
            var tb_th = document.createElement('th')
            tb_th.id = `row-${table_row}-col-${table_data[0][table_collum]}`
            var barra = document.createElement('input')
            barra.type = 'text'
            barra.id = `cell-${table_row}-${table_collum}`
            array_cells.push(barra.id)
            tb_th.style.backgroundColor = 'rgb(189, 223, 223)'
            if (table_data[table_row][table_collum] === undefined){
                barra.value = ' '
            }
            else{
              barra.value = table_data[table_row][table_collum]
            }
            barra.style.width = ((barra.value.length+1)*10)+'px'
            barra.style.border = 'none'
            barra.style.backgroundColor = 'transparent'
            barra.style.textAlign = 'center'
            barra.style.fontWeight = '600'
            tb_th.appendChild(barra)
            tb_tr.appendChild(tb_th)
            table.appendChild(tb_tr)
            
        }
       }
       else{
        //criar linha nova
        var tb_tr = document.createElement('tr')
        tb_tr.id = `tr${table_row}`
        //percorrer cada elemento do array do array
        for (var table_collum = 0;table_collum<table_data[0].length;table_collum++){
            var tb_td = document.createElement('td')
            
            tb_td.id = `row-${table_row}-col-${table_data[0][table_collum]}`
            var barra = document.createElement('input')
            barra.type = 'text'
            barra.id = `cell-${table_row}-${table_collum}`
            array_cells.push(barra.id)
            if (table_data[table_row][table_collum] === undefined){
                barra.value = ' '
            }
            else{
              barra.value = table_data[table_row][table_collum]
            }
            barra.style.width = ((barra.value.length+1)*10)+'px'
            barra.style.border = 'none'
            barra.style.textAlign = 'center'
            barra.classList.add('entrada')
            tb_td.appendChild(barra)
            tb_tr.appendChild(tb_td)
            table.appendChild(tb_tr)
            
        }
       }  
    }
    
    return table
}

window.document.addEventListener('keydown',function(event){
    array_cells.forEach(ids =>{
        if (event.target.id == ids){
           var s = document.getElementById(ids)
           s.addEventListener('input',function(){
            s.style.width = ((s.value.length+1)*10)+'px'
            salvar.style.display = 'block'
           
            //percorrer a string do id e retornar o id no inteiro
            var id_str = s.id
            var id_int = []
            for (var char = 0; char<id_str.length;char++){
                if (!isNaN(id_str[char])){
                    id_int.push(id_str[char])
                    
                }
            }
            //modificar no array dos dados o valor que esta
            array_dados[id_int[0]][id_int[1]] = s.value
            
           })
           
        }
        
    })

    

})

function SalvarConteudo(){
    dados = ''
    array_dados.forEach(function(linha,index){
        linha.forEach(function(coluna,ind){
            if (ind == numero_de_colunas){
                dados = dados + coluna
            }
            else{
               dados = dados + coluna+',' 
            }
            
        })
        dados = dados + '\r\n'
    })
    console.log(dados)
}
