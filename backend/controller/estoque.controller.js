const Estoque = require('../models/Estoque')

const listar = async (req, res) => {
    try {
        const dados = await Estoque.findAll()
        return res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao listar os estoques:', err)
        return res.status(500).json({error: 'Erro ao listar os estoques. Tente novamente mais tarde.'})
    }
}
const atualizar = async (req, res) => {
    const valores = req.body
    try {
        const estoqueExist = await Estoque.findByPk(valores.codEstoque)
        if(!estoqueExist){
            return res.status(404).json({error: "Não foi encontrado nenhum estoque com o código informado!"})
        }
        // Atualizar registro de Estoque
        await Estoque.update(valores,{where:{codEstoque:valores.codEstoque}})
        const estoqueCadastrado = await Estoque.findByPk(valores.codEstoque)
        return res.status(201).json(estoqueCadastrado)
    } catch (err) {
        console.error('Erro ao atualizar o estoque:', err)
        return res.status(500).json({error: 'Erro ao atualizar o estoque. Tente novamente mais tarde.'})
    }
}
const consultar = async (req, res) => {
    const idProduto = req.params.id

    if(!idProduto){
        return res.status(400).json({error: "É preciso informar o ID do produto!"})
    }

    try {
        const estoqueExist = await Estoque.findOne({where:{idProduto: idProduto}})
        if(!estoqueExist){
            return res.status(404).json({error: "Não foi encontrado nenhum estoque para o produto informado!"})
        }
        return res.status(200).json(estoqueExist)
    } catch (err) {
        console.error('Erro ao consultar o estoque:', err)
        return res.status(500).json({error: 'Erro ao consultar o estoque. Tente novamente mais tarde.'})
    }
}

module.exports = { listar, atualizar, consultar }