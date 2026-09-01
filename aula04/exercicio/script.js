var galao = 3.6
var lata = 18

quantidade = {
    largura : 0 ,
    altura : 0 ,
    consumo : 0 ,
    demao : 0 ,
    calcular : function(){
        
        var litros = (((this.largura * this.altura) / this.consumo) * this.demao)
        var latas = Math.floor(litros/lata)
        var sobra = litros % lata
        var galoes = Math.ceil(litros/galao)

        if (litros <= 4 * galao){
            return "Quantidade: " + galoes + " galão(ões)"
        }else{
            //latas = Math.floor(litros/lata)
            galoes = Math.ceil(sobra / galao)
            return "Total calculado: " + litros.toFixed(2) + " litros.<br>" +
                "<br>Quantidade: " + latas + " Lata(s), e mais " + galoes + " galão(ões)"
        }
    }
}

function calcular(){
    largura = document.getElementById("divLargura").value
    altura = document.getElementById("divAltura").value
    consumo = document.getElementById("divConsumo").value
    demao = document.getElementById("divDemao").value

    if( largura == "" || altura == "" || consumo == "" || demao == "" ){
        alert("Preencha os campos Largura, Altura, Consumo e Demão, miserável! =(")
    }else{
        quantidade.largura = largura.replace(",",".")
        quantidade.altura = altura.replace(",",".")
        quantidade.consumo = consumo.replace(",",".")
        quantidade.demao = demao.replace(",",".")
        divResultado = document.getElementById("divResultado")
        divResultado.innerHTML = quantidade.calcular()
    }

    divResultado = document.getElementById("divResultado")
}