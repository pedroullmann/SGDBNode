// Requires
const fs = require('fs')
const junk = require('junk')

// Properties
const listaDiretorio = './lista_espera/'

// Functions
function criaBlock(path, data) {
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

function pegaTodosBlocks() {
    const lista = []
    const arquivos = fs.readdirSync(listaDiretorio)
    const arquivosFiltrados = arquivos.filter(junk.not)
  
    arquivosFiltrados.forEach(element => {
      const elementContent = fs.readFileSync(listaDiretorio + element, 'utf8')
      const json = JSON.parse(elementContent)
      lista.push(json)
    })

    return lista
}

function proximoElementId() {
    const arquivos = fs.readdirSync(listaDiretorio)
    const arquivosFiltrados = arquivos.filter(junk.not)
    const proximoId = arquivosFiltrados.length + 1

    return proximoId
}

// Module
module.exports = ( () => {
    return {
        post: ( request, response ) => {
            const proximoId = proximoElementId()

            const lista = {  
              id: proximoId,
              transacaoBloqueada: request.body.transacaoBloqueada,
              transacaoLiberada: request.body.transacaoLiberada,
              deadlock: false
            }
          
            const data = JSON.stringify(lista)
            criaBlock(`${listaDiretorio}transacao_bloqueada_${request.body.transacaoBloqueada}.json`, data)

            response.send(true)
        },

        get: ( request, response ) => {
            const lista = pegaTodosBlocks()
          
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

                                const lista = {  
                                    id: proximoId,
                                    transacaoBloqueada: elementPai.transacaoBloqueada,
                                    transacaoLiberada: elementFilho.transacaoBloqueada,
                                    deadlock: true
                                }

                                const data = JSON.stringify(lista)
                                criaBlock(`${listaDiretorio}transacao_bloqueada_${elementPai.transacaoBloqueada}.json`, data)
                            } catch(err) {
                                console.error(err)
                            }
                            return
                        }
                    }
                })
            })

            const newList = pegaTodosBlocks()

            response.send(newList)
        }
    }
})()