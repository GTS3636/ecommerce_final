const Entrega = require('../models/Entrega')
const { calcularFrete } = require("../utils/frete")

const cadastrar = async (req, res) => {
    const valores = req.body

    // Campos obrigatórios
    const camposObrigatorios = [
        'idPedido', 'cep', 'logradouro', 'bairro',
        'localidade', 'uf', 'numero', 'statusEntrega'
    ];

    // Validação dos campos obrigatórios
    const camposFaltando = camposObrigatorios.filter(campo => !valores[campo])

    if (camposFaltando.length > 0) {
        return res.status(400).json({
            error: "Todos os campos são obrigatórios!",
            camposFaltando
        })
    }

    try {
        // Validação do CEP via ViaCEP
        const responseCep = await fetch(`https://viacep.com.br/ws/${valores.cep}/json/`)
        const dataCep = await responseCep.json()

        if (dataCep.erro) {
            return res.status(400).json({ error: "O CEP informado é inválido." })
        }

        // Criar registro de entrega
        const dados = await Entrega.create(valores)

        return res.status(201).json(dados)

    } catch (err) {
        console.error('Erro ao cadastrar entrega:', err)
        return res.status(500).json({ error: 'Erro ao cadastrar entrega. Tente novamente mais tarde.' })
    }
}
const listar = async (req, res) => {
    try {
        const dados = await Entrega.findAll()
        return res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao listar as entregas:', err)
        return res.status(500).json({ error: 'Erro ao listar as entrega. Tente novamente mais tarde.' })
    }
}
const atualizar = async (req, res) => {
    const valores = req.body

    // Campos obrigatórios
    const camposObrigatorios = [
        'codEntrega', 'idPedido', 'cep', 'logradouro',
        'bairro', 'localidade', 'uf', 'numero',
        'statusEntrega'
    ];

    // Validação dos campos obrigatórios
    const camposFaltando = camposObrigatorios.filter(campo => !valores[campo])

    if (camposFaltando.length > 0) {
        return res.status(400).json({
            error: "Todos os campos são obrigatórios!",
            camposFaltando
        })
    }

    try {
        const entregaExist = await Entrega.findByPk(valores.codEntrega)
        if (!entregaExist) {
            return res.status(404).json({ error: "Não foi encontrada nenhuma entrega com o código informado!" })
        }
        // Atualizar registro de entrega
        const dados = await Entrega.update(valores, { where: { codEntrega: valores.codEntrega } })
        return res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao atualizar a entrega:', err)
        return res.status(500).json({ error: 'Erro ao atualizar a entrega. Tente novamente mais tarde.' })
    }
}
const consultar = async (req, res) => {
    const codEntrega = req.params.id

    if (!codEntrega) {
        return res.status(400).json({ error: "É preciso informar o código da entrega!" })
    }

    try {
        const entregaExist = await Entrega.findByPk(codEntrega)
        if (!entregaExist) {
            return res.status(404).json({ error: "Não foi encontrada nenhuma entrega com o código informado!" })
        }
        return res.status(200).json(entregaExist)
    } catch (err) {
        console.error('Erro ao consultar a entrega:', err)
        return res.status(500).json({ error: 'Erro ao consultar a entrega. Tente novamente mais tarde.' })
    }
}
const calcularFreteCheckout = async (req, res) => {
    const { uf } = req.body

    try {
        const valorFrete = calcularFrete(uf)

        return res.status(200).json({
            valorFrete: valorFrete,
            valorFormatado: `R$ ${valorFrete.toFixed(2).replace('.', ',')}`
        })
    }
    catch (err) {
        console.error('Erro ao calcular o frete da entrega:', err)
        return res.status(500).json({ error: 'Erro ao calcular o frete da entrega. Tente novamente mais tarde.' })
    }
}

module.exports = { cadastrar, listar, atualizar, consultar, calcularFreteCheckout }