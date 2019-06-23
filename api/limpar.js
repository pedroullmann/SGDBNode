// Requires
const fs = require('fs')
const junk = require('junk')

// Properties
const logsDiretorio = './logs/'
const transacoesDiretorio = './transacoes/'
const banco_temporario_diretorio = './banco_temporario/banco_temporario.json'
const listaDiretorio = './lista_espera/'
const deadlockDiretorio = './deadlock/'
const banco_diretorio = './banco_fisico/banco_fisico.json'

// Functions
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

function removeArquivo(path) {
    try {
        fs.unlinkSync(path)
        return true
    } catch(err) {
        return false
    }
}

// Module
module.exports = ( () => {
    return {
        get: ( request, response ) => {
            // Transacoes
            var arquivos = fs.readdirSync(transacoesDiretorio)
            var arquivosFiltrados = arquivos.filter(junk.not)
          
            arquivosFiltrados.forEach(element => {
                const path = transacoesDiretorio + element
                if ( existeArquivo(path) ) {
                    removeArquivo(path)
                }
            })

            // Logs
            arquivos = fs.readdirSync(logsDiretorio)
            arquivosFiltrados = arquivos.filter(junk.not)

            arquivosFiltrados.forEach(element => {
                var path = logsDiretorio + element
                if ( existeArquivo(path) ) {
                    removeArquivo(path)
                }
            })

            // Banco Temporário
            if ( existeArquivo(banco_temporario_diretorio) ) {
                removeArquivo(banco_temporario_diretorio)
            }

            // Banco Físico
            if ( existeArquivo(banco_diretorio) ) {
                removeArquivo(banco_diretorio)
            }

            // Lista de espera
            arquivos = fs.readdirSync(listaDiretorio)
            arquivosFiltrados = arquivos.filter(junk.not)

            arquivosFiltrados.forEach(element => {
                var path = listaDiretorio + element
                if ( existeArquivo(path) ) {
                    removeArquivo(path)
                }
            })

            // Deadlock
            arquivos = fs.readdirSync(deadlockDiretorio)
            arquivosFiltrados = arquivos.filter(junk.not)

            arquivosFiltrados.forEach(element => {
                var path = deadlockDiretorio + element
                if ( existeArquivo(path) ) {
                    removeArquivo(path)
                }
            })
          
            response.send(true)
        }
    }
})()