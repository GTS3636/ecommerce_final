const Produto = require('../models/Produto')
const Estoque = require("../models/Estoque")

// Importar as associações para garantir que estão carregadas
require('../models/rel')

const cadastrar = async (req, res) => {
    const valores = req.body
    
    // Campos obrigatórios
    const camposObrigatorios = [
        'nome', 'preco', 'ativo', 
        'especificacoes', 'categoria',
        'quantidade_minima'
    ]
    
    // Validação dos campos obrigatórios com a função filter
    const camposFaltando = camposObrigatorios.filter(campo => valores[campo] == null || valores[campo] === '')
    
    if (camposFaltando.length > 0) {
        return res.status(400).json({ 
            error: "Todos os campos são obrigatórios!",
            camposFaltando 
        })
    }
    
    try {
        // Parse especificacoes if it's a string
        if (typeof valores.especificacoes === 'string') {
            valores.especificacoes = JSON.parse(valores.especificacoes)
        }

        // Criar registro de produto e estoque
        const dadosProduto = await Produto.create(valores)
        const produto = await Produto.findByPk(dadosProduto.codProduto)

        const dadosEstoque = await Estoque.create({idProduto: produto.codProduto, quantidade_minima:valores.quantidade_minima})
        const estoque = await Estoque.findByPk(dadosEstoque.codEstoque)

        return res.status(201).json({
            produto:{produto}, 
            estoque:{estoque}
        })
        
    } catch (err) {
        console.error('Erro ao cadastrar produto:', err)
        return res.status(500).json({error: 'Erro ao cadastrar produto. Tente novamente mais tarde.'})
    }
}
const listar = async (req, res) => {
    try {
        const dados = await Produto.findAll()
        return res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao listar os produtos:', err)
        return res.status(500).json({error: 'Erro ao listar os produtos. Tente novamente mais tarde.'})
    }
}
const atualizar = async (req, res) => {
    const valores = req.body
    console.log(valores)
    
     // Campos obrigatórios
    const camposObrigatorios = [
        'codPedido'
    ]
    
    // Validação dos campos obrigatórios com a função filter
    const camposFaltando = camposObrigatorios.filter(campo => valores[campo] == null || valores[campo] === '')
    
    if (camposFaltando.length > 0) {
        return res.status(400).json({ 
            error: "Todos os campos são obrigatórios!",
            camposFaltando 
        })
    }

    try {
        let ProdutoExist = await Produto.findByPk(valores.codProduto)
        if(!ProdutoExist){
            return res.status(404).json({error: "Não foi encontrado nenhum produto com o código informado!"})
        }
        // Atualizar registro de Produto
        await Produto.update(valores,{where:{codProduto:valores.codProduto}})
        ProdutoExist = await Produto.findByPk(valores.codProduto)
        return res.status(201).json(ProdutoExist)
    } catch (err) {
        console.error('Erro ao atualizar o produto:', err)
        return res.status(500).json({error: 'Erro ao atualizar o produto. Tente novamente mais tarde.'})
    }
}
const consultar = async (req, res) => {
    const codProduto = req.params.id
    
    if(!codProduto){
        return res.status(404).json({error: "Todos os campos são obrigatórios!"})
    }
    
    try {
        const ProdutoExist = await Produto.findByPk(codProduto)
        if(!ProdutoExist){
            return res.status(404).json({error: "Não foi encontrado nenhum produto com o código informado!"})
        }
        // Atualizar registro de Produto
        return res.status(201).json(ProdutoExist)
    } catch (err) {
        console.error('Erro ao consultar o produto:', err)
        return res.status(500).json({error: 'Erro ao consultar o produto. Tente novamente mais tarde.'})
    }
}
const deletar = async (req,res) => {
    const valores = req.body
    if(
        !valores.codProduto
    ){
        return res.status(403).json({error: "É preciso informar o código do produto!"})
    }
    try{
        const produtoExist = await Produto.findByPk(valores.codProduto)
        if(!produtoExist){
            return res.status(404).json({error: "Não foi possível encontrar nenhum produto com o código inserido!"})
        }
        await Produto.destroy({where:{codProduto: valores.codProduto}})
        res.status(200).json({message: "Sucesso ao deletar o produto!"})
    }catch(err){
        console.error('Erro ao fazer a deleção do produto: ',err)
        res.status(500).json({error: 'Erro ao fazer a deleção do produto, tente novamente mais tarde!'})
    }
}

const listarHomepage = async (req, res) => {
    try {
        // Buscar produtos ativos com estoque > 0, incluindo dados do estoque
        const dados = await Produto.findAll({
            where: {
                ativo: true
            },
            include: [{
                model: Estoque,
                as: 'estoqueProduto',
                where: {
                    quantidade_atual: {
                        [require('sequelize').Op.gt]: 0
                    }
                }
                // Não precisa de 'required: true' pois todo produto tem estoque automaticamente
            }],
            order: [['codProduto', 'ASC']]
        })
        return res.status(201).json(dados)
    } catch (err) {
        console.error('Erro ao listar produtos da homepage:', err)
        return res.status(500).json({error: 'Erro ao listar produtos da homepage. Tente novamente mais tarde.'})
    }
}
module.exports = { 
    cadastrar, 
    listar, 
    listarHomepage,
    atualizar, 
    deletar, 
    consultar 
}