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
var numero_de_linhas = 0
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
        const div_tab = document.createElement('div')
        div_tab.classList.add('container_tab')
        div_tab.id = 'div_tab'
        div_tab.appendChild(CriarTb(array_dados))
        body.appendChild(div_tab)
        document.querySelector('body').appendChild(salvar)
        var add_btn = document.createElement('button')
        add_btn.classList.add('addbutton')
        add_btn.onclick = addColuna
        add_btn.id ='add'
        var add_btnL = document.createElement('button')
        add_btnL.classList.add('addbutton')
        add_btnL.onclick = addLinha
        add_btnL.id ='addL'
        div_tab.appendChild(add_btn)
        document.querySelector('body').appendChild(add_btnL)
        
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
        numero_de_colunas++
        //percorrer cada elemento do array do array
        for (var table_collum = 0;table_collum<table_data[table_row].length;table_collum++){
            var tb_th = document.createElement('th')
            tb_th.id = `row-${table_row}-col-${table_data[0][table_collum]}`
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
       numero_de_linhas++ 
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
function addLinha(){
    numero_de_linhas++
    console.log(numero_de_linhas)
    var tr = document.createElement('tr')
    var tb = document.getElementById('table')
    tr.id = `tr${numero_de_linhas}`
    array_dados.push([])
    for (var col = 0;col <numero_de_colunas;col++){
        var td = document.createElement('td')
        var barra = document.createElement('input')
        barra.type = 'text'
        barra.id = `cell-${numero_de_colunas}-${col}`
        array_cells.push(barra.id)
        barra.style.width = ((barra.value.length+1)*10)+'px'
        barra.style.border = 'none'
        barra.style.textAlign = 'center'
        barra.value = ' '
        barra.classList.add('entrada')
        td.appendChild(barra)
        tr.appendChild(td)
        tb.appendChild(tr)
    }
}
function addColuna(){
    numero_de_colunas++
    console.log(numero_de_colunas)
    for (var linha = 0; linha< numero_de_linhas;linha++){
        if (linha==0){
            var tr = document.getElementById(`tr${linha}`) 
            var th = document.createElement('th')
            var barra = document.createElement('input')
            barra.type = 'text'
            barra.id = `cell-${linha}-${numero_de_colunas}`
            array_cells.push(barra.id)
            barra.style.width = ((barra.value.length+1)*10)+'px'
            barra.style.border = 'none'
            barra.style.textAlign = 'center'
            barra.classList.add('entrada')
            barra.style.backgroundColor = 'aquamarine'
            barra.style.fontWeight = '600'
            barra.value = ' '
            th.appendChild(barra)
            th.id = `row-${linha}-cow-${numero_de_colunas+1}`
            tr.appendChild(th)
        }
        else{
            var tr = document.getElementById(`tr${linha}`) 
            var td = document.createElement('td')
            var barra = document.createElement('input')
            barra.type = 'text'
            barra.id = `cell-${linha}-${numero_de_colunas}`
            array_cells.push(barra.id)
            barra.style.width = ((barra.value.length+1)*10)+'px'
            barra.style.border = 'none'
            barra.value = ' '
            barra.style.textAlign = 'center'
            barra.classList.add('entrada')
            td.appendChild(barra)
            tr.appendChild(td)
        }
        
    }
    
    
   
    
}
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
        if (index < array_dados.length-1){
            dados = dados + "\r\n"
        }
        
        
        
        
    })
    
   var arquivo = new Blob([dados],{ type: 'text/plain charset=utf-8'})
   const link = document.createElement('a')
   link.href = URL.createObjectURL(arquivo)
   link.download = 'Tabela_atualizada.csv'
   link.click()
}

