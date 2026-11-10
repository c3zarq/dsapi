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
            if (!dados || dados.length === 0) {
                return next(http_errors(400, "Erro ao inserir produto. :("))
            }
            res.status(201).json({resposta: "Produto inserido com sucesso! :)", id: dados[0]})
        })
        .catch(next)
})

api.put("/produto/:id", (req, res, next) => {
    const idProduto = req.params.id

    conn("produtos")
        .where("id", idProduto)
        .update(req.body)
        .then((afetados) => {
            if  (!afetados) {
                return next(http_errors(404, "Produto não encontrado. :("))
            }
            res.status(200).json({ resposta: "produtocadastrado com sucesso! :)"})
        })
        .catch(next)
})

api.delete("/produto/:id", (req, res, next) => {
    const idProduto = req.params.id

    conn("produtos")
        .where("id", idProduto)
        .del()
        .then((afetados) => {
            if (!afetados) {
                return next(http_errors(404, "Produto não encontrado. :("))
            }
            res.status(200).json({resposta: "Produto excluído com sucesso! :)"})
        })
        .catch(next)
})

api.post("/pedidos", async (req, res, next) => {
    
    const {cliente_id, endereco, produtos} = req.body

    if (!cliente_id || !produtos || produtos.length === 0) {
        return res.status(400).json({ erro: "Pedido sem cliente ou sem produtos. :("})
    }

    try {
        await conn.transaction(async (trx) => {
            
            const [pedido_id] = await trx("pedidos").insert({
                cliente_id: cliente_id,
                endereco: endereco || "Retirada no balcão",
                horario: new Date()
            })

            const itensDoPedido = produtos.map(item => ({
                pedido_id: pedido_id,
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                preco: item.preco
            }))

            await trx("pedidos_produtos").insert(itensDoPedido)

            res.status(201).json({
                resposta: "Pedido realizado com sucesso! :)",
                pedido_id: pedido_id
            })
        })
    } catch (error) {
        console.error("Erro no BD:", error)
        res.status(500).json({
            erro: "Falha na transação do banco",
            mensagem_mysql: error.sqlMessage,
        })
    }
})

// Colocando o servidor no ar
api.listen ( PORT, () => {
    console.log(`API rodando em http://${HOSTNAME}:${PORT}`)
})