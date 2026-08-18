// Exercício:
/* Construir um formulário que pergunte ao usuário o seu nome,
seu peso e sua altura.
Pegar estes dados e criar um objeto com estes 3 atributos,
juntamente com uma função calcularIMC.
Exibir na tela o IMC através do retorno da função calcularIMC.*/

usuario = {
    nome : "",
    peso : 0.0 ,
    altura : 0.0 ,
    calcularIMC : function(){
        imc = this.peso / (this.altura * this.altura)
        return imc
    }
}

function calcular(){
    nome = document.getElementById("txtUsuario").value
    peso = document.getElementById("txtPeso").value
    altura = document.getElementById("txtAltura").value

    if ( nome == "" || peso == "" || altura == ""){
        alert("Preencha Nome e Altura!")
    }else{
        usuario.nome = nome
        usuario.peso = peso.replace(",", ".")
        usuario.altura = altura.replace(",", ".")
        divIMC = document.getElementById("divIMC")
        divIMC.innerHTML = "Nome: " + usuario.nome
        divIMC.innerHTML += "<br>Peso: " + usuario.peso
        divIMC.innerHTML += "<br>Altura: " + usuario.altura
        divIMC.innerHTML += "<br>IMC: " + usuario.calcularIMC()

    }

}