const Usuario = require('../models/Usuario')
const { hashSenha } = require('../utils/criptografia')
const { validaCPF } = require("../utils/validaCPF")

const cadastrar = async (req,res) => {
    const valores = req.body

    // Campos obrigatórios
    const camposObrigatorios = [
        'nome', 'email', 'senha', 'telefone', 
        'cpf', 'tipo_usuario'
    ];
    
    // Validação dos campos obrigatórios
    const camposFaltando = camposObrigatorios.filter(campo => !valores[campo])
    
    if (camposFaltando.length > 0) {
        return res.status(400).json({ 
            error: "Todos os campos são obrigatórios!",
            camposFaltando
        })
    }

    try{
        if(!validaCPF(valores.cpf)){
            return res.status(403).json({error: "O CPF inserido é inválido!"})
        }
        valores.senha = await hashSenha(valores.senha)
        const dados = await Usuario.create(valores)
        res.status(201).json(dados)
    }catch(err){
        console.error('Erro ao receber os dados do usuário',err)
        res.status(500).json({error: 'Erro ao receber os dados do usuário'})
    }
}
const consultar = async (req,res) => {
    const nome = req.params.nome
    if(!nome){
        return res.status(403).json({error: "É preciso informar o nome do usuário!"})
    }
    try{
        const usuarioExist = await Usuario.findOne({where:{nome:nome}})
        if(!usuarioExist){
            return res.status(404).json({error: "Não foi possível encontrar nenhum usuário com o nome inserido!"})
        }
        res.status(201).json(usuarioExist)
    }catch(err){
        console.error('Erro ao fazer a atualização do usuário: ',err)
        res.status(500).json({error: 'Erro ao fazer a atualização do usuário, tente novamente mais tarde!'})
    }
}
const listar = async (req,res) => {
    try{
        const dados = await Usuario.findAll()
        res.status(200).json(dados)
    }catch(err){
        console.error('Erro ao listar os usuários',err)
        res.status(500).json({error: 'Erro ao listar os usuários, tente novamente mais tarde!'})
    }
}
const atualizar = async (req,res) => {
    const valores = req.body
    if(!valores.codUsuario){
        return res.status(403).json({error: "É preciso informar ao menos o código do usuário!"})
    }
    try{
        let usuarioExist = await Usuario.findByPk(valores.codUsuario)
        if(!usuarioExist){
            return res.status(404).json({error: "Não foi possível encontrar nenhum usuário com o código inserido!"})
        }
        if(valores.cpf){
            if(!validaCPF(valores.cpf)){
                return res.status(403).json({error: "O CPF inserido é inválido!"})
            }
        }
        if(valores.senha){
            valores.senha = await hashSenha(valores.senha)
        }
        await Usuario.update(valores, {where:{codUsuario:valores.codUsuario}})
        usuarioExist = await Usuario.findByPk(valores.codUsuario)
        res.status(201).json(usuarioExist)
    }catch(err){
        console.error('Erro ao fazer a atualização do usuário: ',err)
        res.status(500).json({error: 'Erro ao fazer a atualização do usuário, tente novamente mais tarde!'})
    }
}
const deletar = async (req,res) => {
    const valores = req.body
    if(
        !valores.codUsuario
    ){
        return res.status(403).json({error: "Todos os campos são obrigatórios!"})
    }
    try{
        const usuarioExist = await Usuario.findByPk(valores.codUsuario)
        if(!usuarioExist){
            return res.status(404).json({error: "Não foi possível encontrar nenhum usuário com o código inserido!"})
        }
        await Usuario.destroy({where:{codUsuario: valores.codUsuario}})
        res.status(200).json({message: "Sucesso ao deletar o usuário!"})
    }catch(err){
        console.error('Erro ao fazer a atualização do usuário: ',err)
        res.status(500).json({error: 'Erro ao fazer a atualização do usuário, tente novamente mais tarde!'})
    }
}
module.exports = { 
    cadastrar, 
    listar, 
    atualizar, 
    deletar, 
    consultar 
}