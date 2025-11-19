const Estoque = require('../models/Estoque')

const cadastrar = async (req, res) => {
    const valores = req.body
    
    // Campos obrigatórios
    const camposObrigatorios = [
        'idProduto', 'quantidade_atual', 'quantidade_minima'
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
        // Criar registro de Estoque
        const dados = await Estoque.create(valores)
        
        return res.status(201).json(dados)
        
    } catch (err) {
        console.error('Erro ao cadastrar estoque:', err)
        return res.status(500).json({error: 'Erro ao cadastrar estoque. Tente novamente mais tarde.'})
    }
}
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
        const dados = await Estoque.update(valores,{where:{codEstoque:valores.codEstoque}})
        return res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao atualizar o estoque:', err)
        return res.status(500).json({error: 'Erro ao atualizar o estoque. Tente novamente mais tarde.'})
    }
}
const consultar = async (req, res) => {
    const valores = req.body
    
    if(!valores.idProduto){
        return res.status(404).json({error: "Todos os campos são obrigatórios!"})
    }
    
    try {
        const estoqueExist = await Estoque.findOne({where:{idProduto: valores.idProduto}})
        if(!estoqueExist){
            return res.status(404).json({error: "Não foi encontrado nenhum estoque com o código informado!"})
        }
        // Atualizar registro de Estoque
        const dados = await Estoque.update(valores,{where:{codEstoque:valores.codEstoque}})
        return res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao atualizar o estoque:', err)
        return res.status(500).json({error: 'Erro ao atualizar o estoque. Tente novamente mais tarde.'})
    }
}

module.exports = { cadastrar, listar, atualizar, consultar }