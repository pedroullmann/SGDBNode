// Requires
const fs = require('fs')
const junk = require('junk')

// Properties
const logsDiretorio = './logs/'

// Module
module.exports = ( () => {
    return {
        get: ( request, response ) => {
            const logs = []
            const arquivos = fs.readdirSync(logsDiretorio)
            const arquivosFiltrados = arquivos.filter(junk.not)
          
            arquivosFiltrados.forEach(element => {
              const elementContent = fs.readFileSync(logsDiretorio + element, 'utf8')
              const json = JSON.parse(elementContent)
              logs.push(json)
            })
          
            response.send(logs)
        },

        post: ( request, response ) => { 
            const arquivos = fs.readdirSync(logsDiretorio)
            const arquivosFiltrados = arquivos.filter(junk.not)
            const proximoId = arquivosFiltrados.length + 1

            const body = JSON.parse(request.body.log)
            body.id = proximoId

            const data = JSON.stringify(body)
            fs.writeFileSync(`${logsDiretorio}log_${proximoId}.json`, data)

            response.send(true)
        }
    }
})()