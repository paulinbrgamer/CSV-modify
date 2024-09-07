const input = document.querySelector('#dados')
var dados;
var linhas = []
var inicio= 0
var string = '';
var retirada = 0
input.addEventListener('change',function(){
    const arquivos = this.files[0]
    const reader = new FileReader()
    reader.addEventListener('load',function(){
        dados = reader.result
       for (var v = 0; v < dados.length;v++){
            if (dados[v] == ',' ){
                for (inicio; inicio<v ;inicio++){
                    if (dados[inicio] === '\n' || dados[inicio] === '\r'){
                    v = inicio-1
                    retirada += 2
                    }
                    else{
                        string = string+dados[inicio]
                        console.log(dados[inicio])
                    }
                    
                        
                    
                
                }
                linhas.push(string)
                string = ''
                inicio++
                
            }
        if (v == dados.length-retirada-1){
            linhas.push(dados[dados.length-retirada-1])
        }
        
        

        
       }
       console.log(linhas)
    })
    reader.readAsText(arquivos)
})
