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

// Colocando o servidor no ar
api.listen ( PORT, () => {
    console.log(`API rodando em http://${HOSTNAME}:${PORT}`)
})