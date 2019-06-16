// Requires
const express = require('express')
const bodyParser = require('body-parser')
const transacoes = require('./api/transacoes')
const fisico = require('./api/fisico')
const temporario = require('./api/temporario')
const lista = require('./api/lista')
const deadlock = require('./api/deadlock')

// Properties
const app = express()
const port = 3003
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// API Transacoes
app.get('/transacoes', transacoes.get)
app.get('/transacoes/:id', transacoes.getOne)
app.post('/transacoes', transacoes.post)
app.patch('/transacoes/:id', transacoes.patch)

// API Banco físico
app.get('/bancofisico', fisico.get)

// API Banco temporário
app.get('/bancotemporario', temporario.get)

// API Lista
app.post('/lista', lista.post)
app.get('/lista', lista.get)

// API Deadlock
app.get('/deadlock/verify', deadlock.verifyDeadlock)
app.get('/deadlock', deadlock.get)
app.post('/deadlock', deadlock.post)

//Recebe banco_temporario e salva no banco_fisico
// app.post('/checkpoint', (req, res) => {
//   const banco_temporario = req.body
// })

//Pega os logs
// app.get('/logs', (req, res) => {
//   const rawdata = fs.readFileSync(`${transacoesDiretorio}transacao_${req.params.id}.json`);  
//   const transacao = JSON.parse(rawdata);
//   res.send(transacao)
// })

//Registra logs
// app.post('/logs', (req, res) => {
//   const log = req.body
// })

// Listener
app.listen(port)