const input = document.querySelector('#dados')
var dados;
input.addEventListener('change',function(){
    const arquivos = this.files[0]
    const reader = new FileReader()
    reader.addEventListener('load',function(){
        
        dados = reader.result
        array = Csv_reader(dados)
        console.log(array)
    })
    reader.readAsText(arquivos)
})

function Csv_reader(data){
    var linhas = []
    var inicio= 0
    var string = '';
    var retirada = 0
    for (var v = 0; v < data.length;v++){
        if (data[v] == ',' ){
            for (inicio; inicio<v ;inicio++){
                string = string+data[inicio]
                console.log(dados[inicio])

            }
            linhas.push(string)
            string = ''
            inicio++
            
        }
        if (v == data.length-retirada-1){
            linhas.push(data[dados.length-retirada-1])
        }
   }
   
    return linhas
}
