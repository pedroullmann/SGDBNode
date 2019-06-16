// Requires
const fs = require('fs')
const junk = require('junk')

// Properties
const listaDiretorio = './lista_espera/'
const deadlockDiretorio = './deadlock/'

// Functions
function criaDeadlock(path, data) {
    try {
      fs.statSync(path)
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            fs.writeFileSync(path, data)
        }
    }
}

function existeArquivo(path) {
    try {
        fs.statSync(path)
        return true
      }
      catch (err) {
          if (err.code === 'ENOENT') {
              return false
          }
      }
}

function pegaTodosBlocks(path) {
    const lista = []
    const arquivos = fs.readdirSync(path)
    const arquivosFiltrados = arquivos.filter(junk.not)
  
    arquivosFiltrados.forEach(element => {
      const elementContent = fs.readFileSync(path + element, 'utf8')
      const json = JSON.parse(elementContent)
      lista.push(json)
    })

    return lista
}

function proximoElementId() {
    const arquivos = fs.readdirSync(deadlockDiretorio)
    const arquivosFiltrados = arquivos.filter(junk.not)
    const proximoId = arquivosFiltrados.length + 1

    return proximoId
}

// Module
module.exports = ( () => {
    return {
        verifyDeadlock: ( request, response ) => {
            const lista = pegaTodosBlocks(listaDiretorio)
            var hasDeadlock = false
          
            lista.forEach (elementPai => {
                lista.forEach (elementFilho => {
                    if (elementPai.id === elementFilho.id) {
                        return
                    } else {
                        const elementPaiPath = `${listaDiretorio}transacao_bloqueada_${elementPai.transacaoBloqueada}.json`
                        const elementFilhoPath = `${listaDiretorio}transacao_bloqueada_${elementFilho.transacaoBloqueada}.json`

                        if (elementPai.transacaoBloqueada === elementFilho.transacaoLiberada &&
                            elementPai.transacaoLiberada === elementFilho.transacaoBloqueada && 
                            existeArquivo(elementPaiPath) && existeArquivo(elementFilhoPath)) {

                            try {
                                fs.unlinkSync(elementPaiPath)
                                fs.unlinkSync(elementFilhoPath)
                                const proximoId = proximoElementId()

                                const deadlock = {  
                                    id: proximoId,
                                    primeira_transacaoBloqueada: elementPai.transacaoBloqueada,
                                    segunda_transacaoBloqueada: elementFilho.transacaoBloqueada
                                }

                                const data = JSON.stringify(deadlock)
                                criaDeadlock(`${deadlockDiretorio}deadlock_${proximoId}.json`, data)

                                hasDeadlock = true
                            } catch(err) {
                                hasDeadlock = false
                            }
                            return
                        }
                    }
                })
            })
            
            if (hasDeadlock === false ) {
                response.sendStatus(401)
            } else {
                response.send(hasDeadlock)
            }
        },

        get: ( request, response ) => {
            const deadlockList = pegaTodosBlocks(deadlockDiretorio)
            response.send(deadlockList)
        },

        post: ( request, response ) => { 
            const deadlockList = pegaTodosBlocks(deadlockDiretorio)
            var removed = false

            deadlockList.forEach (element => {
                const elementPath = `${deadlockDiretorio}deadlock_${element.id}.json`

                if (element.primeira_transacaoBloqueada === request.body.primeira_transacaoBloqueada &&
                    element.segunda_transacaoBloqueada === request.body.segunda_transacaoBloqueada &&
                    existeArquivo(elementPath)) {

                    try {
                        fs.unlinkSync(elementPath)
                        removed = true
                    } catch(err) {
                        removed = false
                    }
                }
            })

            if (removed === false ) {
                response.sendStatus(401)
            } else {
                response.send(removed)
            }
        }
    }
})()