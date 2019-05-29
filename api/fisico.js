// Requires
const fs = require('fs')

// Module
module.exports = ( () => {
    return {
        get: ( response ) => {
            const rawdata = fs.readFileSync(banco_diretorio)
            const banco_fisico = JSON.parse(rawdata)
  
            response.send(banco_fisico)
        }
    }
})()