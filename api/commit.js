// Requires
const extendify = require('extendify')
const fs = require('fs')
const junk = require('junk')

// Properties
const transacoesDiretorio = './transacoes/'
const banco_temporario_diretorio = './banco_temporario/banco_temporario.json'

merge = extendify({
    inPlace: false,
    isDeep: true,
    arrays : 'merge'
})

// Module
module.exports = ( () => { 
    return { 
        post: ( request, response ) => {
            const removedIds = request.body.removedIds

            const temporaryContent = fs.readFileSync(banco_temporario_diretorio, 'utf8')
            const temporaryJson = JSON.parse(temporaryContent)

            const transactionContent = fs.readFileSync(`${transacoesDiretorio}transacao_${request.params.id}.json`, 'utf8')
            const transactionJson = JSON.parse(transactionContent)

            transactionJson.transacao_estado = 1

            if ( removedIds.length > 0 ) {
                removedIds.forEach(element => {
                    temporaryJson.splice(element - 1,1)
                })
            } 

            const result = merge(temporaryJson, transactionJson.visao)

            result.forEach(element => {
                element.bloqueio = 0
                delete element['transacao']
            })

            const data = JSON.stringify(result)
            fs.writeFileSync(banco_temporario_diretorio, data)

            const dataTransaction = JSON.stringify(transactionJson)
            fs.writeFileSync(`${transacoesDiretorio}transacao_${request.params.id}.json`, dataTransaction)

            response.send(transactionJson)
        }
    }
})()