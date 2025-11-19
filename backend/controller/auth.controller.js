const Usuario = require('../model/Usuario')
const { compareSenha } = require('../service/bcrypt.service')
const { gerarToken } = require('../service/jwt.service')

const login = async (req,res)=>{
    const valores = req.body

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