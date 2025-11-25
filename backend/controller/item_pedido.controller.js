const ItemPedido = require('../models/ItemPedido')

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

module.exports = { listar, atualizar }