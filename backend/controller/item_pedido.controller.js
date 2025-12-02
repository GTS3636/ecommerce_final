const ItemPedido = require('../models/ItemPedido')

const listar = async (req, res) => {
    try {
        const dados = await ItemPedido.findAll()
        return res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao listar os itens do pedido:', err)
        return res.status(500).json({ error: 'Erro ao listar os itens do pedido. Tente novamente mais tarde.' })
    }
}
const atualizar = async (req, res) => {
    const valores = req.body
    let dados = valores
    if (!valores.codItemPedido) {
        return res.status(403).json({ error: "É preciso informar ao menos o código do item do pedido!" })
    }
    try {
        let itemPedidoExist = await ItemPedido.findByPk(valores.codItemPedido)
        if (!itemPedidoExist) {
            return res.status(404).json({ error: "Não foi encontrado nenhum item do pedido com o código informado!" })
        }
        console.log(itemPedidoExist);

        if (valores.quantidade !== itemPedidoExist.quantidade) {
            const precoUnitario = valores.precoUnitario ?? itemPedidoExist.precoUnitario;
            const quantidade = valores.quantidade ?? itemPedidoExist.quantidade;

            dados = {
                idPedido: valores.idPedido,
                idProduto: valores.idProduto,
                quantidade: quantidade,
                precoUnitario: precoUnitario,
                valorTotalItem: precoUnitario * quantidade
            }

            Object.keys(dados).forEach((key) => {
                if (dados[key] === "" || dados[key] === undefined) {
                    delete dados[key];
                }
            })
        }
        // Atualizar registro de Produto
        await ItemPedido.update(dados, { where: { codItemPedido: valores.codItemPedido } })
        itemPedidoExist = await ItemPedido.findByPk(valores.codItemPedido)
        return res.status(201).json(itemPedidoExist)
    } catch (err) {
        console.error('Erro ao atualizar o item do pedido:', err)
        return res.status(500).json({ error: 'Erro ao atualizar o item do pedido. Tente novamente mais tarde.' })
    }
}

const cadastrar = async (req, res) => {
    const valores = req.body
    // Validar campos obrigatórios
    if (!valores.idPedido || !valores.idProduto || !valores.quantidade) {
        return res.status(400).json({ error: "É preciso informar idPedido, idProduto, quantidade e precoUnitario!" })
    }

    try {
        // Verificar se já existe um item com o mesmo idPedido e idProduto
        const itemExistente = await ItemPedido.findOne({
            where: {
                idPedido: valores.idPedido,
                idProduto: valores.idProduto
            }
        })

        if (itemExistente) {
            return res.status(409).json({ error: "Já existe um item com este produto neste pedido!" })
        }

        // Calcular valor total do item
        const valorTotalItem = valores.quantidade * valores.precoUnitario

        // Criar novo item de pedido
        const novoItem = await ItemPedido.create({
            idPedido: valores.idPedido,
            idProduto: valores.idProduto,
            quantidade: valores.quantidade,
            precoUnitario: valores.precoUnitario,
            valorTotalItem: valorTotalItem
        })

        return res.status(201).json(novoItem)
    } catch (err) {
        console.error('Erro ao cadastrar o item do pedido:', err)
        return res.status(500).json({ error: 'Erro ao cadastrar o item do pedido. Tente novamente mais tarde.' })
    }
}

const consultar = async (req, res) => {
    const codItemPedido = req.params.id

    if (!codItemPedido) {
        return res.status(400).json({ error: "É preciso informar o código do item do pedido!" })
    }

    try {
        const itemPedidoExist = await ItemPedido.findByPk(codItemPedido)
        if (!itemPedidoExist) {
            return res.status(404).json({ error: "Não foi encontrado nenhum item do pedido com o código informado!" })
        }
        return res.status(200).json(itemPedidoExist)
    } catch (err) {
        console.error('Erro ao consultar o item do pedido:', err)
        return res.status(500).json({ error: 'Erro ao consultar o item do pedido. Tente novamente mais tarde.' })
    }
}

const deletar = async (req, res) => {
    const codItemPedido = req.params.id

    if (!codItemPedido) {
        return res.status(400).json({ error: "É preciso informar o código do item do pedido!" })
    }

    try {
        const itemPedidoExist = await ItemPedido.findByPk(codItemPedido)
        if (!itemPedidoExist) {
            return res.status(404).json({ error: "Não foi encontrado nenhum item do pedido com o código informado!" })
        }

        // Deletar o item do pedido
        await ItemPedido.destroy({ where: { codItemPedido: codItemPedido } })

        return res.status(200).json({ message: "Item do pedido deletado com sucesso!" })
    } catch (err) {
        console.error('Erro ao deletar o item do pedido:', err)
        return res.status(500).json({ error: 'Erro ao deletar o item do pedido. Tente novamente mais tarde.' })
    }
}

module.exports = { listar, atualizar, cadastrar, consultar, deletar }