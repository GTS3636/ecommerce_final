const Pedido = require('../models/Pedido')

const cadastrar = async (req, res) => {
    const valores = req.body
    
    const camposObrigatorios = [
        'idProduto', 'quantidade_atual', 'quantidade_minima'
    ]

    const camposFaltando = camposObrigatorios.filter(campo => !valores[campo])
    
    if (camposFaltando.length > 0) {
        return res.status(400).json({ 
            error: "Todos os campos são obrigatórios!",
            camposFaltando 
        })
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
        const pedidoExist = await Pedido.findByPk(valores.codPedido)
        if(!pedidoExist){
            return res.status(404).json({error: "Não foi encontrado nenhum estoque com o código informado!"})
        }
        // Atualizar registro de Estoque
        const dados = await Pedido.update(valores,{where:{codPedido:valores.codPedido}})
        return res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao atualizar o pedido:', err)
        return res.status(500).json({error: 'Erro ao atualizar o pedido. Tente novamente mais tarde.'})
    }
}
const consultar = async (req, res) => {
    const valores = req.body
    
    if(!valores.codPedido){
        return res.status(404).json({error: "É preciso informar o código do pedido!"})
    }
    
    try {
        const pedidoExist = await Pedido.findByPk(valores.codPedido)
        if(!pedidoExist){
            return res.status(404).json({error: "Não foi encontrado nenhum estoque com o código informado!"})
        }
        const dados = await Pedido.update(valores,{where:{codPedido:valores.codPedido}})
        return res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao atualizar o pedido:', err)
        return res.status(500).json({error: 'Erro ao atualizar o pedido. Tente novamente mais tarde.'})
    }
}

module.exports = { cadastrar, listar, atualizar, consultar }