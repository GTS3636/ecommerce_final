const Pedido = require('../models/Pedido')
const Usuario = require("../models/Usuario")
const Entrega = require('../models/Entrega')
const ItemPedido = require('../models/ItemPedido')
const Estoque = require('../models/Estoque')
const Produto = require('../models/Produto')
const { calcularFrete } = require('../utils/frete')
const sequelize = require('../db/conn')

const buscarEnderecoPorCEP = async (cep) => {
    try {
        const cepLimpo = cep.replace(/\D/g, '') // Remove caracteres não numéricos
        
        if (cepLimpo.length !== 8) {
            throw new Error('CEP inválido')
        }
        
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        
        if (response.data.erro) {
            throw new Error('CEP não encontrado')
        }
        
        return {
            cep: response.data.cep,
            logradouro: response.data.logradouro,
            complemento: response.data.complemento || '',
            bairro: response.data.bairro,
            localidade: response.data.localidade,
            uf: response.data.uf
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error)
        throw new Error('Não foi possível buscar o endereço. Verifique o CEP informado.')
    }
}

const cadastrar = async (req, res) => {
    const { idUsuario, cep, numero, complemento, itens } = req.body
    
    // Validação dos campos obrigatórios
    if (!idUsuario || !cep || !numero || !itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({
            error: "Campos obrigatórios: idUsuario, cep, numero, itens (array de produtos)"
        })
    }

    // Validação dos itens
    for (const item of itens) {
        if (!item.idProduto || !item.quantidade || item.quantidade <= 0) {
            return res.status(400).json({
                error: "Cada item deve ter idProduto e quantidade > 0"
            })
        }
    }

    // Verificar se usuário existe
    const usuarioConsultado = await Usuario.findByPk(idUsuario)
    if (!usuarioConsultado) {
        return res.status(404).json({ error: "Usuário não encontrado!" })
    }

    // Buscar dados do endereço via ViaCEP
    let dadosEndereco
    try {
        dadosEndereco = await buscarEnderecoPorCEP(cep)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }

    // Montar objeto de entrega completo
    const entrega = {
        ...dadosEndereco,
        numero,
        complemento: complemento || dadosEndereco.complemento
    }

    const transaction = await sequelize.transaction()

    try {
        // 1. Buscar todos os produtos de uma vez
        const produtoIds = itens.map(i => i.idProduto)
        const produtos = await Produto.findAll({
            where: { idProduto: produtoIds },
            transaction
        })

        // 2. Validar os produtos encontrado e calcular antes de criar registros
        if (produtos.length !== itens.length) {
            throw { status: 404, message: 'Um ou mais produtos não encontrados' }
        }

        const itensComPreco = itens.map(item => {
            const produto = produtos.find(p => p.idProduto === item.idProduto)
            const valorItem = parseFloat(produto.preco) * item.quantidade
            return { ...item, precoUnitario: produto.preco, valorTotalItem: valorItem }
        })

        const subtotal = itensComPreco.reduce((sum, i) => sum + i.valorTotalItem, 0)
        const valorFrete = calcularFrete(entrega.uf)
        const valorTotal = subtotal + valorFrete

        // 3. Verificar estoque com lock
        for (const item of itensComPreco) {
            const estoque = await Estoque.findOne({
                where: { idProduto: item.idProduto },
                lock: transaction.LOCK.UPDATE,
                transaction
            })

            if (!estoque || estoque.quantidade_atual < item.quantidade) {
                throw { 
                    status: 400, 
                    message: `Estoque insuficiente para produto ${item.idProduto}` 
                }
            }
        }

        // 4. Criar registros
        const pedido = await Pedido.create({
            idUsuario,
            valorSubtotal: subtotal.toFixed(2),
            valorFrete: valorFrete.toFixed(2),
            valorTotal: valorTotal.toFixed(2)
        }, { transaction })

        // Criar entrega
        const entregaCriada = await Entrega.create({
            idPedido: pedido.codPedido,
            ...entrega
        }, { transaction })

        // 5. Criar itens e atualizar estoque
        const itensCriados = []
        for (const item of itensComPreco) {
            const itemPedido = await ItemPedido.create({
                idPedido: pedido.codPedido,
                idProduto: item.idProduto,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario.toFixed(2),
                valorTotalItem: item.valorTotalItem.toFixed(2)
            }, { transaction })

            await Estoque.decrement('quantidade_atual', {
                by: item.quantidade,
                where: { idProduto: item.idProduto },
                transaction
            })

            itensCriados.push(itemPedido)
        }

        // Commit da transação
        await transaction.commit()

        // Retornar sucesso com detalhes
        return res.status(201).json({
            message: "Pedido cadastrado com sucesso!",
            pedido: {
                codPedido: pedido.codPedido,
                dataPedido: pedido.dataPedido,
                status: pedido.status,
                valorSubtotal: pedido.valorSubtotal,
                valorFrete: pedido.valorFrete,
                valorTotal: pedido.valorTotal
            },
            entrega: {
                cep: entregaCriada.cep,
                logradouro: entregaCriada.logradouro,
                complemento: entregaCriada.complemento,
                bairro: entregaCriada.bairro,
                localidade: entregaCriada.localidade,
                uf: entregaCriada.uf,
                numero: entregaCriada.numero
            },
            itens: itensCriados.map(item => ({
                idProduto: item.idProduto,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario,
                valorTotalItem: item.valorTotalItem
            }))
        })
    } catch (err) {
        await transaction.rollback()
        
        // Tratamento de erros customizados
        if (err.status) {
            return res.status(err.status).json({ error: err.message })
        }
        
        console.error('Erro ao cadastrar pedido:', err)
        return res.status(500).json({ error: 'Erro ao cadastrar pedido. Tente novamente mais tarde.' })
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