const ItemPedido = require('../models/ItemPedido')
const Pedido = require("../models/Pedido")

const cadastrar = async (req, res) => {
    const valores = req.body
    
    // Campos obrigatórios
    const camposObrigatorios = [
        'idPedido', 'idProduto', 'quantidade', 'precoUnitario'
    ]

    const pedidoConsultado = await Pedido.findByPk(idPedido)
    if(!pedidoConsultado){
        return res.status(404).json({error: "Não foi possível encontrar o pedido com o ID informado!"})
    } else if(pedidoConsultado.status === "CANCELADO"){
        return res.status(400).json({error: "O pedido informado contém seu status como cancelado, logo não podemos cadastrar um item ao pedido!"})
    }
    
    // Validação dos campos obrigatórios com a função filter
    const camposFaltando = camposObrigatorios.filter(campo => !valores[campo])
    
    if (camposFaltando.length > 0) {
        return res.status(400).json({ 
            error: "Todos os campos são obrigatórios!",
            camposFaltando 
        })
    }
    
    try {
        const valorTotalItem = valores.quantidade * valores.precoUnitario
        // Criar registro de produto
        const dados = await ItemPedido.create({
            idPedido: valores.idPedido,
            idProduto: valores.idProduto,
            quantidade: valores.quantidade,
            precoUnitario: valores.precoUnitario,
            valorTotalItem: valorTotalItem
        })
        return res.status(201).json(dados)
        
    } catch (err) {
        console.error('Erro ao cadastrar item do pedido:', err)
        return res.status(500).json({error: 'Erro ao cadastrar item do pedido. Tente novamente mais tarde.'})
    }
}
const listar = async (req, res) => {
    try {
        const dados = await ItemPedido.findAll()
        return res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao listar os itens do pedido:', err)
        return res.status(500).json({error: 'Erro ao listar os itens do pedido. Tente novamente mais tarde.'})
    }
}
const atualizar = async (req, res) => {
    const valores = req.body
    if(!valores.codItemPedido){
        return res.status(403).json({error: "É preciso informar ao menos o código do item do pedido!"})
    }
    try {
        const itemPedidoExist = await ItemPedido.findByPk(valores.codItemPedido)
        if(!itemPedidoExist){
            return res.status(404).json({error: "Não foi encontrado nenhum item do pedido com o código informado!"})
        }
        // Atualizar registro de Produto
        const dados = await ItemPedido.update(valores,{where:{codItemPedido:valores.codItemPedido}})
        return res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao atualizar o item do pedido:', err)
        return res.status(500).json({error: 'Erro ao atualizar o item do pedido. Tente novamente mais tarde.'})
    }
}

module.exports = { cadastrar, listar, atualizar }