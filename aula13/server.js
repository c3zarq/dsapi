require('dotenv').config();
const express = require('express');
const { OAuth2Client } = require('google-auth-library'); // Importa a classe de cliente OAuth2 oficial do Google
const crypto = require ('crypto');

const app = express();
const PORT = process.env.PORT || 3000; // Define a porta do servidor, usando a do .env ou 3000 por padrão

const oAuth2Client = new OAuth2Client ( // Instancia novo cliente oAuth2
    process.env.CLIENT_ID, // Lê i ID do cliente configurado no Googlee Cloud
    process.env.CLIENT_SECRET, // Lê a chave doo cliente
    process.env.REDIRECT_URI // Lê a URL de callback autorizada
);

const activeStates = new Set(); // Cria um conjunto em memória para armazenar e validar os tokens 'state'

app.get('/', (req, res) => { // Rota raiz
    res.send(`
        
        <div style="
                font-family: monospace; 
                text-align: center; 
                margin-top: 50px;
            "> 

            <hr> 

            <h2>APLICAÇÃO OAUTH2</h2> 

            <br> 

            <a href="/auth/google" 
                style="padding: 10px 20px; 
                background-color: #4285F4; 
                color: white; 
                text-decoration: none; 
                border-radius: 5px; 
                font-weight: bold;"
            > [ Entrar com Google ] </a> 

            <br><br> 

            <hr>

        </div>
        `)
})

app.get('/auth/google', (req, res) => { // Rota 2 - login
    const state = crypto.randomBytes(16).toString('hex'); // Gera uma string hexadecimal aleatória de 16 bytes
    activeStates.add(state); // Adiciona a string gerada à memória do servidor para posterior validação

    const authorizeUrl =oAuth2Client.generateAuthUrl({
        access_type: 'offline', // Acesso offline
        scope: ['openid', 'profile', 'email'], // Solicita acesso a estes dados
        state: state // Anexa parâmetreo de segurança na URL gerada
    });

    res.redirect(authorizeUrl); // Redirecioona para a URL do Google gerada
});

app.get('/auth/google/callback', async (req, res) => { // Rota 3 - callback
    const { code, state } = req.query; // Desestrutura os parâmetros 'code' e 'state' da URL recebida

    if (!state || !activeStates.has(state)) { // Verifica se o 'state' retornou e se existe no nosso registro de memória
        return res.status(403).send('Erro de Segurança: Parâmetro state inválido. Possível ataque CSRF.'); // Trava o fluxo e retorna erro 403 se a validação falhar
    }
    activeStates.delete(state); // Remove o state da memória

    try { // Inicia o bloco de tratamento de excessões para chamadas assíncronas
        
        const { tokens } = await oAuth2Client.getToken(code); // Dispara a requisição trocando o 'code' pelo 'access_token' e 'id_token'

        const ticket = await oAuth2Client.verifyIdToken({ // Verificaçção de integridade e assinatura
            idToken: tokens.id_token, // Informa qual token precisa ser validado
            audience: process.env.CLIENT_ID // Informa qual Client ID deve ser o destinatário
        });

        const payload = ticket.getPayload(); // Decodifica o token validado para ler os dados do usuário (email, nome, foto, etc)

        const userName = payload.given_name || payload.name; // Obtém o primeiro nome, ou o nome completo

        res.send(`
            <div style="
                    font-family: monospace; 
                    text-align: center; 
                    margin-top: 50px;
                ">
                <hr> 

                <h2>LOGIN REALIZADO!</h2> 

                <br> 

                <h3>Olá, ${userName}!</h3> 

                <br>                
                <hr> 
            </div>
        `);

    } catch (error) { // Captura falhas na troca de tokens ou validação do id_token
        console.error('Erro na autenticação OAuth2:', error); // Registra os detalhes técnicos do erro 
    }
});

app.listen(PORT, () => { // Inicia o servidor
    console.log(`Servidoor rodando em http://localhost:${PORT}`); 
    console.log(`Pressione Ctrl+C para encerrar.`)
});