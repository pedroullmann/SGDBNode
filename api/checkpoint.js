// Requires
const fs = require('fs')
const junk = require('junk')

// Properties
const banco_temporario_diretorio = './banco_temporario/banco_temporario.json'
const banco_diretorio = './banco_fisico/banco_fisico.json'

// Module
module.exports = ( () => {
    return {
        post: ( request, response ) => {
            const banco_temporario_file = fs.readFileSync(banco_temporario_diretorio)
            fs.writeFileSync(banco_diretorio, banco_temporario_file)

            console.log(fs.readFileSync(banco_diretorio))

            response.send(true)
        }
    }
})()