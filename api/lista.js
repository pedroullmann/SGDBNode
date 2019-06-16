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
              transacaoLiberada: request.body.transacaoLiberada
            }
          
            const data = JSON.stringify(lista)
            criaBlock(`${listaDiretorio}transacao_bloqueada_${request.body.transacaoBloqueada}.json`, data)

            response.send(true)
        },

        get: ( request, response ) => {
            const lista = pegaTodosBlocks()
            response.send(lista)
        }
    }
})()