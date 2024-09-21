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
var salvar = document.getElementById('save')
var numero_de_colunas = 0
var numero_de_linhas = 0
//salvar cores
var lncor = document.getElementById('l_color')
var hdcor = document.getElementById('hd_color')
hdcor.value = sessionStorage.getItem('header')
lncor.value = sessionStorage.getItem('line')
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
    document.getElementById('arquivo_nome').style.display = 'block'
    //instanciar um leitor para esse arquivo
    const reader = new FileReader()

    //adicionar um evento ao leitor para quando o arquivo for carregado
    reader.addEventListener('load',function(){
        
        //guardar a leitura desse arquivo na variavel string
        dados = reader.result
        //chamar função e passar a variavel string como parametro para que os dados retornem como um array
        array_dados = Csv_reader(dados)
        const body = document.querySelector("body")
        const divmax = document.createElement('div')
        const div_tab = document.createElement('div')
        const div_ta2 = document.createElement('div')
        div_ta2.classList.add('container_tab')
        div_ta2.id = 'div_ta2'
        div_tab.classList.add('container_tab')
        div_tab.id = 'div_tab'
        divmax.id = 'divmax'
        div_tab.appendChild(CriarTb(array_dados))
        divmax.appendChild(div_tab)
        divmax.appendChild(div_ta2)
        divmax.classList.add('container_tab')
        divmax.style.flexDirection = 'column'
        var add_btn = document.createElement('button')
        add_btn.classList.add('addbutton')
        add_btn.onclick = addColuna
        var add_btnL = document.createElement('button')
        add_btnL.classList.add('addbutton')
        add_btnL.onclick = addLinha
        add_btnL.id ='addL'
        add_btnL.style.marginBottom = '5px'
        div_tab.appendChild(add_btn)
        div_tab.appendChild(document.createElement('br'))
        div_ta2.appendChild(add_btnL)
        var remo_col = document.createElement('button')
        remo_col.classList.add('removebutton')
        remo_col.onclick = delColl
        remo_col.id ='remove'
        div_tab.appendChild(remo_col)
        var remo_lin = document.createElement('button')
        remo_lin.classList.add('removebutton')
        remo_lin.onclick = delLinha
        remo_lin.id ='removel'
        div_ta2.appendChild(remo_lin)
        document.getElementById("Screen_table").appendChild(divmax)
        mudarHD()
        mudarL()
        Tamanho()
        console.log(array_dados)
        
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
            //criar o paragrafo da celula
            let p = document.createElement('p')
            p.id = `p-${table_row}-${table_collum}`
            var tb_th = document.createElement('th')
            tb_th.id = `row-${table_row}-col-${table_collum}`
            var barra = document.createElement('input')
            barra.type = 'text'
            barra.id = `cell-${table_row}-${table_collum}`
            barra.classList.add('entrada')
            barra.style.fontWeight = '600'
            p.style.fontWeight = '600'
            barra.style.padding = '4px'
            p.style.minHeight = '20px'
            p.style.minWidth = '25px'
            p.style.padding = '4px'
            array_cells.push(barra.id)
            //colocar o valor da celula no paragrafo e no input, desaativando o input para que fique só paragrafo
            if (table_data[table_row][table_collum] == ' '){
                barra.value = ''
                p.textContent = ''
            }
            else{
              barra.value = table_data[table_row][table_collum]
              p.textContent = table_data[table_row][table_collum]
            }
            barra.style.display = 'none'
            tb_th.appendChild(p)
            tb_th.appendChild(barra)
            tb_tr.appendChild(tb_th)
            barra.addEventListener('keydown',function(event){
                if(event.key == 'Enter'){
                var id_str = event.target.id
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
                var nextbar =  document.getElementById(`row-${Number(int1)+1}-col-${int2}`)
                if (Number(int1)+1 < numero_de_linhas){
                    nextbar.click()
                }
                else{
                    if (Number(int2)+1 < numero_de_colunas){
                    int2++
                    int1 = 0
                    nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                    nextbar.click()  
                    }
                    else{
                    int2 = 0
                    int1 = 0
                    nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                    nextbar.click()  
                    }
                    
                }
                }
                if(event.key == 'Tab'){
                    event.preventDefault()
                    var id_str = event.target.id
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
                    var nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)+1}`)
                    if (Number(int2)+1 < numero_de_colunas){
                        nextbar.click()
                    }
                    else{
                        if (Number(int1)+1 < numero_de_linhas){
                        int2 = 0
                        int1++
                        nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                        nextbar.click()  
                        }
                        else{
                        int2 = 0
                        int1 = 0
                        nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                        nextbar.click()  
                        }
                        
                    }
                }
            })
            tb_th.addEventListener('click',function(clicado){
                var id_str = clicado.target.id
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
                //barra da celula clicada
                var bar = document.getElementById(`cell-${int1}-${int2}`)
                //paragrafo da celula clicada
                var pa = document.getElementById(`p-${int1}-${int2}`)
                bar.style.display = 'block'
                p.style.display = 'none'
                bar.focus()
            })
            barra.addEventListener('blur',function(event){
                    var id_str = event.target.id
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
                    var txto = document.getElementById(`cell-${int1}-${int2}`).value // pega o texto do input e coloca na vareavel
                    p.textContent = txto //bota a variavel no paragrafo 
                    document.getElementById(`row-${int1}-col-${int2}`).appendChild(p) //bota o paragrafo na celula
                    document.getElementById(`cell-${Number(int1)}-${int2}`).style.display = 'none' //oculta a barra
                    document.getElementById(`p-${Number(int1)}-${int2}`).style.display = 'block' //mostrar paragrado
            })
            table.appendChild(tb_tr)     
            }
       }
       else{
        //criar linha nova
        var tb_tr = document.createElement('tr')
        tb_tr.id = `tr${table_row}`
        //percorrer cada elemento do array do array
        for (var table_collum = 0;table_collum<table_data[0].length;table_collum++){
            let p = document.createElement('p')
            p.id = `p-${table_row}-${table_collum}`
            var tb_td = document.createElement('td')
            tb_td.id = `row-${table_row}-col-${table_collum}`
            var barra = document.createElement('input')
            barra.type = 'text'
            barra.id = `cell-${table_row}-${table_collum}`
            barra.style.padding = '4px'
            p.style.minHeight = '20px'
            p.style.minWidth = '25px'
            p.style.padding = '4px'
            array_cells.push(barra.id)

            //colocar o valor da celula no paragrafo e no input, desaativando o input para que fique só paragrafo
            if (table_data[table_row][table_collum] == ' '){
                barra.value = ''
                p.textContent = ''
            }
            else{
              barra.value = table_data[table_row][table_collum]
              p.textContent = table_data[table_row][table_collum]
            }
            barra.style.display = 'none'
            tb_td.appendChild(p)
            //termina aqui
            tb_td.appendChild(barra)
            tb_tr.appendChild(tb_td)
            tb_td.addEventListener('click',function(clicado){
                var id_str = clicado.target.id
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
                //barra da celula clicada
                var bar = document.getElementById(`cell-${int1}-${int2}`)
                //paragrafo da celula clicada
                var pa = document.getElementById(`p-${int1}-${int2}`)
                bar.style.display = 'block'
                p.style.display = 'none'
                bar.focus()
            })
            barra.addEventListener('blur',function(event){
                var id_str = event.target.id
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
                var txto = document.getElementById(`cell-${Number(int1)}-${int2}`).value // pega o texto do input e coloca na vareavel
                p.textContent = txto //bota a variavel no paragrafo 
                document.getElementById(`row-${int1}-col-${int2}`).appendChild(p) //bota o paragrafo na celula
                document.getElementById(`cell-${Number(int1)}-${int2}`).style.display = 'none' //oculta a barra
                document.getElementById(`p-${Number(int1)}-${int2}`).style.display = 'block' //mostrar paragrado
            })
            barra.addEventListener('keydown',function(event){
                if(event.key == 'Enter'){
                var id_str = event.target.id
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
                var nextbar =  document.getElementById(`row-${Number(int1)+1}-col-${int2}`)
                if (Number(int1)+1 < numero_de_linhas){
                    nextbar.click()
                }
                else{
                    if (Number(int2)+1 < numero_de_colunas){
                    int2++
                    int1 = 0
                    nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                    nextbar.click()  
                    }
                    else{
                    int2 = 0
                    int1 = 0
                    nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                    nextbar.click()  
                    }
                    
                }
                }
                if(event.key == 'Tab'){
                    event.preventDefault()
                    var id_str = event.target.id
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
                    var nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)+1}`)
                    console.log(nextbar)
                    if (Number(int2)+1 < numero_de_colunas){
                        nextbar.click()
                    }
                    else{
                        if (Number(int1)+1 < numero_de_linhas){
                        int2 = 0
                        int1++
                        nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                        nextbar.click()  
                        }
                        else{
                            int2 = 0
                        int1 = 0
                        nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                        nextbar.click()  
                        }
                        
                    }
                }
                
            })
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
           })
        }
    })
})
function addLinha(){
    
    salvar.style.display = 'block'
    numero_de_linhas++
    Tamanho()
    var tr = document.createElement('tr')
    var tb = document.getElementById('table')
    tr.id = `tr${numero_de_linhas-1}`
    array_dados.push([])
    console.log("linha Update ")
    console.log(array_dados)
    for (var col = 0;col <numero_de_colunas;col++){
        let p = document.createElement('p')
        p.id = `p-${numero_de_linhas-1}-${col}`
        var td = document.createElement('td')
        var barra = document.createElement('input')
        td.id = `row-${numero_de_linhas-1}-col-${col}`
        barra.type = 'text'
        barra.id = `cell-${array_dados.length-1}-${col}`
        barra.style.border = 'none'
        barra.style.textAlign = 'center'
        barra.value = ''
        barra.classList.add('entrada')
        td.style.Height = '4px'
        barra.style.padding = '4px'
        p.style.minHeight = '20px'
        p.style.padding = '4px'
        barra.style.display = 'none'
        td.appendChild(p)
        array_cells.push(barra.id)
        td.appendChild(barra)
        tr.appendChild(td)
        td.addEventListener('click',function(clicado){
            var id_str = clicado.target.id
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
            //barra da celula clicada
            var bar = document.getElementById(`cell-${int1}-${int2}`)
            //paragrafo da celula clicada
            var pa = document.getElementById(`p-${int1}-${int2}`)
            bar.style.display = 'block'
            p.style.display = 'none'
            bar.focus()
        })
        barra.addEventListener('blur',function(event){
            var id_str = event.target.id
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
            var txto = document.getElementById(`cell-${Number(int1)}-${int2}`).value // pega o texto do input e coloca na vareavel
            p.textContent = txto //bota a variavel no paragrafo 
            document.getElementById(`row-${int1}-col-${int2}`).appendChild(p) //bota o paragrafo na celula
            document.getElementById(`cell-${Number(int1)}-${int2}`).style.display = 'none' //oculta a barra
            document.getElementById(`p-${Number(int1)}-${int2}`).style.display = 'block' //mostrar paragrado
        })
        barra.addEventListener('keydown',function(event){
            if(event.key == 'Enter'){
            var id_str = event.target.id
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
            var nextbar =  document.getElementById(`row-${Number(int1)+1}-col-${int2}`)
            if (Number(int1)+1 < numero_de_linhas){
                nextbar.click()
            }
            else{
                if (Number(int2)+1 < numero_de_colunas){
                int2++
                int1 = 0
                nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                nextbar.click()  
                }
                else{
                int2 = 0
                int1 = 0
                nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                nextbar.click()  
                }
                
            }
            }
            if(event.key == 'Tab'){
                event.preventDefault()
                var id_str = event.target.id
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
                var nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)+1}`)
                console.log(nextbar)
                if (Number(int2)+1 < numero_de_colunas){
                    nextbar.click()
                }
                else{
                    if (Number(int1)+1 < numero_de_linhas){
                    int2 = 0
                    int1++
                    nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                    nextbar.click()  
                    }
                    else{
                        int2 = 0
                    int1 = 0
                    nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                    nextbar.click()  
                    }
                    
                }
            }
        })
        tb.appendChild(tr)
        array_dados[numero_de_linhas-1][col] =''
        mudarL()
        document.getElementById('Screen_table').scrollTo(0,document.getElementById('Screen_table').scrollWidth);
    }

}
function addColuna(){
    
    salvar.style.display = 'block'
    numero_de_colunas++
    Tamanho()
    console.log(array_dados)
    for (var linha = 0; linha< numero_de_linhas;linha++){
        if (linha==0){
            let p = document.createElement('p')
            p.id = `p-${linha}-${numero_de_colunas-1}`
            var tr = document.getElementById(`tr${linha}`) 
            var th = document.createElement('th')
            var barra = document.createElement('input')
            th.id = `row-${linha}-col-${numero_de_colunas-1}`
            barra.type = 'text'
            barra.id = `cell-${0}-${numero_de_colunas-1}`
            array_cells.push(barra.id)
            barra.style.border = 'none'
            barra.style.textAlign = 'center'
            barra.classList.add('entrada')
            barra.style.fontWeight = '600'
            p.style.fontWeight = '600'
            barra.value = ''
            th.style.Height = '4px'
            barra.style.padding = '4px'
            p.style.minHeight = '20px'
            p.style.minWidth = '20px'
            p.style.padding = '4px'
            barra.style.display = 'none'
            th.appendChild(p)
            th.appendChild(barra)
            tr.appendChild(th)
            th.addEventListener('click',function(clicado){
                var id_str = clicado.target.id
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
                //barra da celula clicada
                var bar = document.getElementById(`cell-${int1}-${int2}`)
                //paragrafo da celula clicada
                var pa = document.getElementById(`p-${int1}-${int2}`)
                bar.style.display = 'block'
                p.style.display = 'none'
                bar.focus()
            })
            barra.addEventListener('blur',function(event){
                var id_str = event.target.id
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
                var txto = document.getElementById(`cell-${Number(int1)}-${int2}`).value // pega o texto do input e coloca na vareavel
                p.textContent = txto //bota a variavel no paragrafo 
                document.getElementById(`row-${int1}-col-${int2}`).appendChild(p) //bota o paragrafo na celula
                document.getElementById(`cell-${Number(int1)}-${int2}`).style.display = 'none' //oculta a barra
                document.getElementById(`p-${Number(int1)}-${int2}`).style.display = 'block' //mostrar paragrado
            })
            barra.addEventListener('keydown',function(event){
                if(event.key == 'Enter'){
                var id_str = event.target.id
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
                var nextbar =  document.getElementById(`row-${Number(int1)+1}-col-${int2}`)
                if (Number(int1)+1 < numero_de_linhas){
                    nextbar.click()
                }
                else{
                    if (Number(int2)+1 < numero_de_colunas){
                    int2++
                    int1 = 0
                    nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                    nextbar.click()  
                    }
                    else{
                    int2 = 0
                    int1 = 0
                    nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                    nextbar.click()  
                    }
                    
                }
                }
                if(event.key == 'Tab'){
                    event.preventDefault()
                    var id_str = event.target.id
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
                    var nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)+1}`)
                    console.log(nextbar)
                    if (Number(int2)+1 < numero_de_colunas){
                        nextbar.click()
                    }
                    else{
                        if (Number(int1)+1 < numero_de_linhas){
                        int2 = 0
                        int1++
                        nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                        nextbar.click()  
                        }
                        else{
                            int2 = 0
                        int1 = 0
                        nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                        nextbar.click()  
                        }
                        
                    }
                }
            })
            document.getElementById('Screen_table').scrollTo(document.getElementById('Screen_table').scrollWidth, window.scrollY);
        }
        else{
            let p = document.createElement('p')
            p.id = `p-${linha}-${numero_de_colunas-1}`
            var tr = document.getElementById(`tr${linha}`) 
            var td = document.createElement('td')
            var barra = document.createElement('input')
            td.id = `row-${linha}-col-${numero_de_colunas-1}`
            barra.type = 'text'
            barra.id = `cell-${linha}-${numero_de_colunas-1}`
            array_cells.push(barra.id)
            barra.style.border = 'none'
            barra.value = ''
            barra.style.textAlign = 'center'
            barra.classList.add('entrada')
            td.style.Height = '4px'
            barra.style.padding = '4px'
            p.style.minHeight = '20px'
            p.style.padding = '4px'
            barra.style.display = 'none'
            td.appendChild(p)
            td.appendChild(barra)
            td.addEventListener('click',function(clicado){
                var id_str = clicado.target.id
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
                //barra da celula clicada
                var bar = document.getElementById(`cell-${int1}-${int2}`)
                //paragrafo da celula clicada
                var pa = document.getElementById(`p-${int1}-${int2}`)
                bar.style.display = 'block'
                p.style.display = 'none'
                bar.focus()
            })
            barra.addEventListener('blur',function(event){
                var id_str = event.target.id
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
                var txto = document.getElementById(`cell-${Number(int1)}-${int2}`).value // pega o texto do input e coloca na vareavel
                p.textContent = txto //bota a variavel no paragrafo 
                document.getElementById(`row-${int1}-col-${int2}`).appendChild(p) //bota o paragrafo na celula
                document.getElementById(`cell-${Number(int1)}-${int2}`).style.display = 'none' //oculta a barra
                document.getElementById(`p-${Number(int1)}-${int2}`).style.display = 'block' //mostrar paragrado
            })
            barra.addEventListener('keydown',function(event){
                if(event.key == 'Enter'){
                var id_str = event.target.id
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
                var nextbar =  document.getElementById(`row-${Number(int1)+1}-col-${int2}`)
                if (Number(int1)+1 < numero_de_linhas){
                    nextbar.click()
                }
                else{
                    if (Number(int2)+1 < numero_de_colunas){
                    int2++
                    int1 = 0
                    nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                    nextbar.click()  
                    }
                    else{
                    int2 = 0
                    int1 = 0
                    nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                    nextbar.click()  
                    }
                    
                }
                }
                if(event.key == 'Tab'){
                    event.preventDefault()
                    var id_str = event.target.id
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
                    var nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)+1}`)
                    console.log(nextbar)
                    if (Number(int2)+1 < numero_de_colunas){
                        nextbar.click()
                    }
                    else{
                        if (Number(int1)+1 < numero_de_linhas){
                        int2 = 0
                        int1++
                        nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                        nextbar.click()  
                        }
                        else{
                            int2 = 0
                        int1 = 0
                        nextbar =  document.getElementById(`row-${Number(int1)}-col-${Number(int2)}`)
                        nextbar.click()  
                        }
                        
                    }
                }
            })
            tr.appendChild(td)
            
        }
        array_dados[linha][numero_de_colunas-1] =''
    }
    
    mudarHD()
    mudarL()
    
}
function delColl(){
    
    salvar.style.display = 'block'
    if(numero_de_colunas-1 >= 1){
    for (var linha = 0; linha< numero_de_linhas;linha++){
        var tr = document.getElementById(`tr${linha}`)
        var col = document.getElementById(`row-${linha}-col-${numero_de_colunas-1}`)
        tr.removeChild(col)
        array_dados[linha].splice(numero_de_colunas-1,linha+1)
    }
    numero_de_colunas--
    Tamanho()
    console.log(array_dados)
    }
}
function delLinha(){
    
    salvar.style.display = 'block'
    if(numero_de_linhas-1 >= 1){
    var tr = document.getElementById(`tr${numero_de_linhas-1}`)
    document.getElementById('table').removeChild(tr)
    array_dados.splice(numero_de_linhas-1,numero_de_linhas-1)
    numero_de_linhas--
    Tamanho()
    console.log(array_dados)
    }
    
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
function Tamanho(){
    document.getElementById('size').innerText = `${numero_de_colunas}x${numero_de_linhas}`
}
function mudarHD(){
    var hdcor = document.getElementById('hd_color').value
    sessionStorage.setItem('header',`${hdcor}`)
    document.querySelectorAll('th').forEach(function(cor){
        cor.style.backgroundColor = sessionStorage.getItem('header')
    })
}
function mudarL(){
    var lncor = document.getElementById('l_color').value
    sessionStorage.setItem('line',`${lncor}`)
    document.querySelectorAll('td').forEach(function(cor){
        cor.style.backgroundColor = sessionStorage.getItem('line')
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
        document.getElementById('arquivo_nome').style.display = 'block'
    }
    
    nome_arquivo = document.getElementById('CSV_nome').value
    numero_de_colunas = document.getElementById('new_col').value
    numero_de_linhas = document.getElementById('new_lin').value
    document.getElementById('arquivo_nome').innerText = nome_arquivo
    document.getElementById('arquivo_nome').style.display = 'block'
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
        div_tab.classList.add('container_tab')
        div_tab.id = 'div_tab'
        divmax.id = 'divmax'
        div_tab.appendChild(CriarTb(array_dados))
        divmax.appendChild(div_tab)
        divmax.appendChild(div_ta2)
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
        add_btnL.style.marginBottom = '5px'
        div_tab.appendChild(add_btn)
        div_tab.appendChild(document.createElement('br'))
        div_ta2.appendChild(add_btnL)
        var remo_col = document.createElement('button')
        remo_col.classList.add('removebutton')
        remo_col.onclick = delColl
        remo_col.id ='remove'
        div_tab.appendChild(remo_col)
        var remo_lin = document.createElement('button')
        remo_lin.classList.add('removebutton')
        remo_lin.onclick = delLinha
        remo_lin.id ='removel'
        div_ta2.appendChild(remo_lin)
        document.getElementById("Screen_table").appendChild(divmax)
        mudarHD()
        mudarL()
        document.getElementById('new_csv').style.display = 'none'
        salvar.style.display = 'flex'
        Tamanho()

}
function exibirNovo(){
    if(document.getElementById('new_csv').style.display == 'flex'){
        document.getElementById('new_csv').style.display = 'none'

    }
    else{
        document.getElementById('new_csv').style.display = 'flex'
        
    }
    
}
