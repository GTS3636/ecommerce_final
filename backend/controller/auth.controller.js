const Usuario = require('../models/Usuario')
const { compareSenha } = require('../utils/criptografia')
const { gerarToken } = require('../utils/tokenJWT')

const login = async (req,res)=>{
    const valores = req.body

    if(!valores.email || !valores.senha){
        return res.status(403).json({error: "Todos os campos são obrigatórios!"})
    }

    try{
        const usuario = await Usuario.findOne({where: { email: valores.email}})

        if(!usuario){
            return res.status(404).json({error: "Usuario não encontrado!"})
        }

        const senhaValida = await compareSenha(valores.senha, usuario.senha)

        if(!senhaValida){
            return res.status(401).json({error: "Senha inválida!"})
        }

        const token = gerarToken({
            codUsuario: usuario.codUsuario,
            email: usuario.email
        })

        res.status(200).json({message: "Login realizado com sucesso!", token})

    }catch(err){
        res.status(500).json({error: "Erro ao realizar o login!"})
    }
}

module.exports = { login }