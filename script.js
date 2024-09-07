//variavel para guardar arquivo selecionado
const input = document.querySelector('#dados')
//variavel string para guardar os dados em forma de texto do arquivo csv
var dados;

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
        Linhas = Csv_reader(dados)
        console.log(array)
    })
    //ler os dados como texto
    reader.readAsText(arquivos)
})

//função que pega os dados em forma de texto e faz a analise lexa para dividir os dados e guardar cada "celula" em um array
function Csv_reader(data){
    //array que contera todas as celulas
    var linhas = []
    //
    var inicio= 0
    var string = '';
    var retirada = 0
    for (var v = 0; v <= data.length;v++){
        if (data[v] == ',' ){
            for (inicio; inicio<v ;inicio++){
                string = string+data[inicio]
                

            }
            linhas.push(string)
            string = ''
            inicio++
            
        }
        if (typeof dados[v] == "undefined"){
            for (inicio; inicio<v ;inicio++){
                string = string+data[inicio]
                

            }
            linhas.push(string)
            string = ''
            inicio++
        }
        
        
        
   }
   
    return linhas
}
