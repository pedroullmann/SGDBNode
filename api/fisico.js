// Requires
const fs = require('fs')
const banco_diretorio = './banco_fisico/banco_fisico.json'

// Module
module.exports = ( () => {
    return {
        get: ( request, response ) => {
            const rawdata = fs.readFileSync(banco_diretorio)
            const banco_fisico = JSON.parse(rawdata)
  
            response.send(banco_fisico)
        }
    }
})()