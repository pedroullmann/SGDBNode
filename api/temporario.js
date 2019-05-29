// Requires
const fs = require('fs')

// Properties
const banco_diretorio = './banco_fisico/banco_fisico.json'
const banco_temporario_diretorio = './banco_temporario/banco_temporario.json'

// Auxiliary function
function criaBancos(path) {
    try {
      fs.statSync(path)
    }
    catch (err) {
      if (err.code === 'ENOENT') {
        const banco = []
        const data = JSON.stringify(banco)
        fs.writeFileSync(path, data)
      }
    }
  }
  
// Module
module.exports = ( () => {
    return {
        get: ( response ) => {
            criaBancos(banco_diretorio)
            criaBancos(banco_temporario_diretorio)
          
            const rawdata = fs.readFileSync(banco_temporario_diretorio)
            const banco_temporario = JSON.parse(rawdata)
          
            response.send(banco_temporario)
        }
    }
})()
  