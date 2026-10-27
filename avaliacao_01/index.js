const express = require('express')
const knex = require('knex')
const http_errors = require('http-errors')

const PORT = 8001
const HOSTNAME = "localhost"

const api = express()
api.use(express.json())
api.use(express.urlencoded( { extended : true } ) )

// Criar conexão com o db_dsapi
const conn = knex( { 
    client : "mysql",
    connection : {
        host : HOSTNAME, 
        user : "root",
        password : "",
        database : "db_dsapi"
    }
} )

// Endpoints
api.get( "/", (req, res, next) => {
    res.status(200)
    res.json( { resposta: "Welcome to db_dsapi"})
})

api.get( "/produto", (req, res, next) => {
    conn("produtos")
        .join( "categorias", "produtos.categoria_id", "=", "categorias.id")
        .select("produtos.*", "categorias.nome AS cat")
        .orderBy("produtos.nome")
        .then( (dados) => {
            res.status(200)
            res.json ( dados)
        })
        .catch(next)
})

api.get("/produto/:id", (req,res, next) => {
    const idProduto = req.params.id

    conn("produtos")
        .join("categorias", "produtos.categoria_id", "=", "categorias.id")
        .select("produtos.*", "categorias.nome AS cat")
        .where("produtos.id", idProduto)
        .first()
        .then( (dados) => {
            res.status(200)
            res.json ( dados )
        })
        .catch(next)
})

api.post("/produto", (req, res, next) => {
    conn("produtos")
        .insert(req.body)
        .then((dados) => {
            if (!dados){
                return next (http_errors(404, "Erro ao inserir"))
            }
            res.status(201)
            res.json ({resposta: "Produto inserido!", id: dados[0]})
        })
        .catch(next)
})

// Colocando o servidor no ar
api.listen ( PORT, () => {
    console.log(`API rodando em http://${HOSTNAME}:${PORT}`)
})