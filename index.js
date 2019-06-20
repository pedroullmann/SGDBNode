// Requires
const express = require('express')
const bodyParser = require('body-parser')
const transacoes = require('./api/transacoes')
const fisico = require('./api/fisico')
const temporario = require('./api/temporario')
const lista = require('./api/lista')
const deadlock = require('./api/deadlock')
const logs = require('./api/logs')

// Properties
const app = express()
const port = 3003
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// API Transacoes
app.get('/transacoes', transacoes.get)
app.get('/transacoes/:id', transacoes.getOne)
app.post('/transacoes', transacoes.post)
app.post('/transacoes/:id', transacoes.rollback)
app.patch('/transacoes/:id', transacoes.patch)

// API Banco físico
app.get('/bancofisico', fisico.get)

// API Banco temporário
app.get('/bancotemporario', temporario.get)

// API Lista
app.post('/lista', lista.post)
app.get('/lista', lista.get)
app.post('/lista/:bloqueada/:liberada', lista.deleteBlock)

// API Deadlock
app.get('/deadlock/verify', deadlock.verifyDeadlock)
app.get('/deadlock', deadlock.get)
app.post('/deadlock', deadlock.post)

// API Logs
app.get('/logs', logs.get)
app.post('/logs', logs.post)

// Listener
app.listen(port)