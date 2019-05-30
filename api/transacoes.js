// Requires
const fs = require('fs')
const junk = require('junk')

// Properties
const transacoesDiretorio = './transacoes/'
const banco_temporario_diretorio = './banco_temporario/banco_temporario.json'

// Module
module.exports = ( () => {
    return {
        get: ( request, response ) => {
            const transacoes = []
            const arquivos = fs.readdirSync(transacoesDiretorio)
            const arquivosFiltrados = arquivos.filter(junk.not)
          
            arquivosFiltrados.forEach(element => {
              const elementContent = fs.readFileSync(transacoesDiretorio + element, 'utf8')
              const json = JSON.parse(elementContent)
              transacoes.push(json)
            })
          
            response.send(transacoes)
        },

        getOne: ( request, response ) => {
            const rawdata = fs.readFileSync(`${transacoesDiretorio}transacao_${request.params.id}.json`)
            const transacao = JSON.parse(rawdata)

            response.send(transacao)
        },

        post: ( request, response ) => {
            const arquivos = fs.readdirSync(transacoesDiretorio)
            const arquivosFiltrados = arquivos.filter(junk.not)
            const proximoId = arquivosFiltrados.length + 1
          
            const banco_temporario_file = fs.readFileSync(banco_temporario_diretorio)
            const visao = JSON.parse(banco_temporario_file)
          
            const transacao = {  
              id: proximoId,
              nome: `Transacao ${proximoId}`,
              visao: visao,
              transacao_estado: 0
            }
          
            const data = JSON.stringify(transacao)
            fs.writeFileSync(`${transacoesDiretorio}transacao_${proximoId}.json`, data)

            response.send(transacao)
        },

        patch: ( request, response ) => { 
            fs.writeFileSync(`${transacoesDiretorio}transacao_${request.params.id}.json`, `${request.body.transaction}`)
            
            response.send(true)
        }
    }
})()