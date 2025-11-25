const Pedido = require('../models/Pedido')
const Usuario = require("../models/Usuario")

const cadastrar = async (req, res) => {
    const valores = req.body
    
    const camposObrigatorios = [
        'idUsuario'
    ]

    const camposFaltando = camposObrigatorios.filter(campo => !valores[campo])
    
    if (camposFaltando.length > 0) {
        return res.status(400).json({ 
            error: "Todos os campos são obrigatórios!",
            camposFaltando 
        })
    }

    const usuarioConsultado = await Usuario.findByPk(valores.idUsuario)

    if(!usuarioConsultado){
        return res.status(404).json({error: "Não foi possível encontrar o usuário com o ID informado!"})
    }
    
    try {
        const dados = await Pedido.create(valores)
        
        return res.status(201).json(dados)
        
    } catch (err) {
        console.error('Erro ao cadastrar pedido:', err)
        return res.status(500).json({error: 'Erro ao cadastrar pedido. Tente novamente mais tarde.'})
    }
}
const listar = async (req, res) => {
    try {
        const dados = await Pedido.findAll()
        return res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao listar os pedidos:', err)
        return res.status(500).json({error: 'Erro ao listar os pedidos. Tente novamente mais tarde.'})
    }
}
const atualizar = async (req, res) => {
    const valores = req.body
    try {
        let pedidoExist = await Pedido.findByPk(valores.codPedido)
        if(!pedidoExist){
            return res.status(404).json({error: "Não foi encontrado nenhum pedido com o código informado!"})
        }
        // Atualizar registro de Estoque
        await Pedido.update(valores,{where:{codPedido:valores.codPedido}})
        pedidoExist = await Pedido.findByPk(valores.codPedido)
        return res.status(201).json(pedidoExist)
    } catch (err) {
        console.error('Erro ao atualizar o pedido:', err)
        return res.status(500).json({error: 'Erro ao atualizar o pedido. Tente novamente mais tarde.'})
    }
}
const consultar = async (req, res) => {
    const codPedido = req.params.id
    
    if(!codPedido){
        return res.status(404).json({error: "É preciso informar o código do pedido!"})
    }
    
    try {
        let pedidoExist = await Pedido.findByPk(codPedido)
        if(!pedidoExist){
            return res.status(404).json({error: "Não foi encontrado nenhum pedido com o código informado!"})
        }
        pedidoExist = await Pedido.findByPk(codPedido)
        return res.status(200).json(pedidoExist)
    } catch (err) {
        console.error('Erro ao atualizar o pedido:', err)
        return res.status(500).json({error: 'Erro ao atualizar o pedido. Tente novamente mais tarde.'})
    }
}

module.exports = { cadastrar, listar, atualizar, consultar }