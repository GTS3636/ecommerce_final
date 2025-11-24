const { verificarToken } = require('../utils/tokenJWT')

function authMiddleware(req,res,next){
    const authHeader = req.headers['authorization']

    if(!authHeader){
        return res.status(401).json({ error: 'Token não fornecido! Não tem autorização!'})
    }

    const token = authHeader.split(' ')[1]
    console.log('token Extraído: ', token)

    const dadosToken = verificarToken(token)
    console.log('dados do token: ', dadosToken)

    if(!dadosToken){
        return res.status(403).json({error: "Token inválido!"})
    }

    next()
}

module.exports = authMiddleware