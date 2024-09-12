//variavel para guardar arquivo selecionado
const input = document.querySelector('#dados')
//variavel string para guardar os dados em forma de texto do arquivo csv
var dados;
//variavel com todas aslinhas guardadas em arrays diferentes
var array_dados = [];
var nome_arquivo;
//array que contem o id de todas as cells
var array_cells = []
//botao de salvar
var salvar = document.createElement('input')
salvar.type = 'button'
salvar.value = 'Salvar'
salvar.style.display = 'none'
salvar.classList.add('hov')
salvar.style.margin = 'auto'
salvar.style.marginTop = '20px'
salvar.onclick = SalvarConteudo
salvar.id = 'save'
var numero_de_colunas = 0

var numero_de_linhas = 0
//acionar evento quando o estado do leitor de arquivo mudar
input.addEventListener('change',function(){
        if(document.getElementById('table') != null){
            document.getElementById('table').remove()
            document.getElementById('divmax').remove()
            numero_de_colunas = 0
            numero_de_linhas = 0
            array_cells = []
            nome_arquivo = ''
            array_dados = [];
            dados = ''
        }
    //selecionar o primeiro arquivo e guardar na variavel
    const arquivos = this.files[0]
    nome_arquivo = this.files[0].name
    document.getElementById('arquivo_nome').innerText = nome_arquivo
    //instanciar um leitor para esse arquivo
    const reader = new FileReader()

    //adicionar um evento ao leitor para quando o arquivo for carregado
    reader.addEventListener('load',function(){
        
        //guardar a leitura desse arquivo na variavel string
        dados = reader.result
        //chamar função e passar a variavel string como parametro para que os dados retornem como um array
        console.log(dados)
        array_dados = Csv_reader(dados)
        const body = document.querySelector("body")
        const divmax = document.createElement('div')
        const div_tab = document.createElement('div')
        const div_ta2 = document.createElement('div')
        div_ta2.classList.add('container_tab')
        div_ta2.id = 'div_ta2'
        div_ta2.style.display = 'flex'
        div_ta2.style.width = '100%'
        div_ta2.style.justifyContent = 'flex-start'
        div_tab.classList.add('container_tab')
        div_tab.id = 'div_tab'
        divmax.id = 'divmax'
        div_tab.appendChild(CriarTb(array_dados))
        divmax.appendChild(div_tab)
        divmax.appendChild(div_ta2)
        document.getElementById('header').appendChild(salvar)
        divmax.classList.add('container_tab')
        divmax.style.flexDirection = 'column'
        var add_btn = document.createElement('button')
        add_btn.classList.add('addbutton')
        add_btn.onclick = addColuna
        add_btn.id ='add'
        var add_btnL = document.createElement('button')
        add_btnL.classList.add('addbutton')
        add_btnL.onclick = addLinha
        add_btnL.id ='addL'
        add_btnL.style.marginLeft = '15px'
        div_tab.appendChild(add_btn)
        div_tab.appendChild(document.createElement('br'))
        div_ta2.appendChild(add_btnL)
        div_ta2.style.margin = '0px'
        div_ta2.style.padding = '0px'
        div_tab.style.margin = '0px'
        div_tab.style.padding = '0px'
        body.appendChild(divmax)
        mudarHD()
        mudarL()
        console.log(array_dados)
        console.log("numero de col "+numero_de_colunas)
        
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
            if(string.length<1){
                string = ' '
            }
            linhas.push(string)
            linhas_totais.push(linhas)
            linhas = []
            string = ''
            //pular o \r e o \n por isso numero é dois
            inicio_palavra+= 2
            primeira_linha = false
            numero_de_linhas++
        }
        //condição para encontrar a virgula que separa os dados
         if (data[fim_palavra] == ',' || data[fim_palavra] == ';'){

            //laço for que percorre a string até a virgula e guarda ela na variavel string
            for (inicio_palavra; inicio_palavra<fim_palavra ;inicio_palavra++){
                
                string = string+data[inicio_palavra]
            }
            if(string.length<1){
                string = ' '
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
            if(string.length<1){
                string = ''
            }
            linhas.push(string)
            linhas_totais.push(linhas)
            linhas = []
            string = ''
            inicio_palavra++
            numero_de_colunas++
            numero_de_linhas++
        }
        
        
        
   }
   
   linhas_totais.forEach(function(linha){
    while (linhas_totais[0].length > linha.length){
        linha.push("")
        
        
        
    }
        
   })
    return linhas_totais
}
//função que cria a tabela e tem como parametro o array de linhas do CSV
function CriarTb(table_data){
    //cria a tabela
    
    
    const table = document.createElement('table')
    table.id = 'table'
    table.style.margin = '10px'
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
            if (table_data[table_row][table_collum] === undefined){
                barra.value = ''
            }
            else{
              barra.value = table_data[table_row][table_collum]
            }
            if (barra.value.length ==0){
                barra.style.width = ((barra.value.length+5)*15)+'px'
            }
            else{
                barra.style.width = ((barra.value.length+1)*15)+'px'
            }
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
            if (table_data[table_row][table_collum] == ' '){
                barra.value = ''
            }
            else{
              barra.value = table_data[table_row][table_collum]
            }
            if (barra.value.length ==0){
                barra.style.width = ((barra.value.length+5)*15)+'px'
            }
            else{
                barra.style.width = ((barra.value.length+1)*15)+'px'
            }
            
            barra.style.backgroundColor = 'transparent'
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
                    if (id_str[char+1] == '-'){
                        id_int.push(id_str[char+1])
                    }
                    
                    
                }
            }
            var int1 = ''
            var int2 = ''
            var chave = 0
            id_int.forEach(function(v){
                if(v == '-'){
                    chave =1
                }
                if(v!= '-' && chave ==0){
                    int1 += v
                    
                }
                if(v!= '-' && chave >0){
                    int2 += v
                }
            })
            if (int2 == array_dados[int1].length){
                array_dados[int1][int2-1] = s.value
            }
            else{
                array_dados[int1][int2] = s.value
            }
            //modificar no array dos dados o valor que esta
            
            console.log(array_dados)
            console.log('tipe ')
            console.log("int1 = "+int1)
            console.log("int2 = "+int2)
            
           })
           
        }
        
    })

    

})
function addLinha(){
    salvar.style.display = 'block'
    numero_de_linhas++
    var tr = document.createElement('tr')
    var tb = document.getElementById('table')
    tr.id = `tr${numero_de_linhas-1}`
    array_dados.push([])
    console.log("linha Update ")
    console.log(array_dados)
    for (var col = 0;col <numero_de_colunas;col++){
        var td = document.createElement('td')
        var barra = document.createElement('input')
        barra.type = 'text'
        barra.id = `cell-${array_dados.length-1}-${col}`
        array_cells.push(barra.id)
        barra.style.border = 'none'
        barra.style.textAlign = 'center'
        barra.value = ''
        barra.style.backgroundColor = 'transparent'
        barra.classList.add('entrada')
        if (barra.value.length ==0){
            barra.style.width = ((barra.value.length+5)*15)+'px'
        }
        else{
            barra.style.width = ((barra.value.length+1)*15)+'px'
        }
        td.appendChild(barra)
        tr.appendChild(td)
        tb.appendChild(tr)
        array_dados[numero_de_linhas-1][col] =''
        mudarL()
        window.scrollTo(0,document.body.scrollWidth);
    }

}
function addColuna(){
    salvar.style.display = 'block'
    numero_de_colunas++
    console.log("Col Update ")
    console.log(array_dados)
    
    for (var linha = 0; linha< numero_de_linhas;linha++){
        if (linha==0){
            var tr = document.getElementById(`tr${linha}`) 
            var th = document.createElement('th')
            var barra = document.createElement('input')
            barra.type = 'text'
            barra.id = `cell-${0}-${numero_de_colunas-1}`
            array_cells.push(barra.id)
            barra.style.border = 'none'
            barra.style.textAlign = 'center'
            barra.classList.add('entrada')
            barra.style.backgroundColor = 'transparent'
            barra.style.fontWeight = '600'
            if (barra.value.length ==0){
                barra.style.width = ((barra.value.length+5)*15)+'px'
            }
            else{
                barra.style.width = ((barra.value.length+1)*15)+'px'
            }
            barra.value = ''
            th.appendChild(barra)
            th.id = `row-${0}-cow-${numero_de_colunas}`
            tr.appendChild(th)
            window.scrollTo(document.body.scrollWidth, window.scrollY);
        }
        else{
            
            var tr = document.getElementById(`tr${linha}`) 
            var td = document.createElement('td')
            var barra = document.createElement('input')
            barra.type = 'text'
            barra.id = `cell-${linha}-${numero_de_colunas-1}`
            array_cells.push(barra.id)
            barra.style.border = 'none'
            barra.value = ''
            barra.style.backgroundColor = 'transparent'
            barra.style.textAlign = 'center'
            barra.classList.add('entrada')
            if (barra.value.length ==0){
                barra.style.width = ((barra.value.length+5)*15)+'px'
            }
            else{
                barra.style.width = ((barra.value.length+1)*15)+'px'
            }
            td.appendChild(barra)
            tr.appendChild(td)
            
        }
        array_dados[linha][numero_de_colunas-1] =''
    }
    
    mudarHD()
    mudarL()
    
}
function SalvarConteudo(){
    document.getElementById('save').style.display = 'none'
    dados = ''
    array_dados.forEach(function(linha,index){
        linha.forEach(function(coluna,ind){
            if (ind == linha.length-1){
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
    console.log("string salva- \n"+dados)
    console.log(array_dados)
   var arquivo = new Blob([dados],{ type: 'text/csv charset=utf-8'})
   const link = document.createElement('a')
   link.href = URL.createObjectURL(arquivo)
    link.download = nome_arquivo
   link.click()
}

function mudarHD(){
        document.querySelectorAll('th').forEach(function(cor){
            cor.style.backgroundColor = document.getElementById('hd_color').value
        })
}
function mudarL(){
    document.querySelectorAll('td').forEach(function(cor){
        cor.style.backgroundColor = document.getElementById('l_color').value
    })
}
function NovoCSV(){
    //apagar arquivo
    if(document.getElementById('table') != null){
        document.getElementById('table').remove()
        document.getElementById('divmax').remove()
        numero_de_colunas = 0
        numero_de_linhas = 0
        array_cells = []
        nome_arquivo = ''
        array_dados = [];
        dados = ''
        document.getElementById('arquivo_nome').innerText= nome_arquivo
    }
    
    nome_arquivo = document.getElementById('CSV_nome').value
    numero_de_colunas = document.getElementById('new_col').value
    numero_de_linhas = document.getElementById('new_lin').value
    document.getElementById('arquivo_nome').innerText = nome_arquivo
    for(var l = 0;l<numero_de_linhas;l++){
        array_dados.push([])
        for(var c = 0;c<numero_de_colunas;c++){
            array_dados[l][c] = ''
        }
    }
    const body = document.querySelector("body")
        const divmax = document.createElement('div')
        const div_tab = document.createElement('div')
        const div_ta2 = document.createElement('div')
        div_ta2.classList.add('container_tab')
        div_ta2.id = 'div_ta2'
        div_ta2.style.display = 'flex'
        div_ta2.style.width = '100%'
        div_ta2.style.justifyContent = 'flex-start'
        div_tab.classList.add('container_tab')
        div_tab.id = 'div_tab'
        divmax.id = 'divmax'
        div_tab.appendChild(CriarTb(array_dados))
        divmax.appendChild(div_tab)
        divmax.appendChild(div_ta2)
        document.getElementById('header').appendChild(salvar)
        divmax.classList.add('container_tab')
        divmax.style.flexDirection = 'column'
        var add_btn = document.createElement('button')
        add_btn.classList.add('addbutton')
        add_btn.onclick = addColuna
        add_btn.id ='add'
        var add_btnL = document.createElement('button')
        add_btnL.classList.add('addbutton')
        add_btnL.onclick = addLinha
        add_btnL.id ='addL'
        add_btnL.style.marginLeft = '15px'
        div_tab.appendChild(add_btn)
        div_tab.appendChild(document.createElement('br'))
        div_ta2.appendChild(add_btnL)
        div_ta2.style.margin = '0px'
        div_ta2.style.padding = '0px'
        div_tab.style.margin = '0px'
        div_tab.style.padding = '0px'
        body.appendChild(divmax)
        mudarHD()
        mudarL()
}
function exibirNovo(){
    if(document.getElementById('new_csv').style.display == 'block'){
        document.getElementById('new_csv').style.display = 'none'
    }
    else{
        document.getElementById('new_csv').style.display = 'block'
    }
    
}