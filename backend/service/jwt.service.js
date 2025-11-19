const jwt = require('jsonwebtoken')
const SEGREDO = 'nosso_segredo_secreto'

function gerarToken(payload){
    return jwt.sign(payload, SEGREDO, { expiresIn: '3h'})
}

function verificarToken(token){
    try{
        return jwt.verify(token,SEGREDO)
    }catch(err){
        console.error('Erro ao verificar o token')
        return null
    }
}

module.exports = { gerarToken, verificarToken }
