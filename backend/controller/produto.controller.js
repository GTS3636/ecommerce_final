const produtoService = require('../services/produto.service');
class ProdutoController {
    async cadastrar(req, res) {
        try {
            const novoProduto = await produtoService.criarProduto(req.body)
            return res.status(201).json(novoProduto)
        } catch (err) {
            console.error("Erro ao cadastrar o produto: ", err);
            
            const statusCode = err.statusCode || 500
            return res.status(statusCode).json({
                error: "Erro ao cadastrar o produto, tente novamente mais tarde."
            })
        }
    }

    async consultarPorId (req, res) {
        try {
            const codProduto = req.params.id
            if(!codProduto){
                return res.status(400).json({error: "É necessário informar o ID do produto para consulta!"})
            }
            const produto = produtoService.buscarProdutoPorId(codProduto)
            return res.status(200).json(produto)
        } catch (err) {
            console.error("Erro ao consultar o produto por ID: ", err)
            const statusCode = err.statusCode || 500
            return res.status(statusCode).json({
                error: "Erro ao consultar o produto por ID, tente novamente mais tarde."
            })
        }
    }

    async atualizar (req, res) {
        try {
            const valores = req.body
            const produtoCad = produtoService.atualizarProduto(valores)
            return res.status(200).json(produtoCad)
        } catch (err) {
            console.error("Erro ao atualizar o produto: ",err)
            const statusCode = err.statusCode || 500
            return res.status(statusCode).json({
                error: "Erro ao atualizar o produto, tente novamente mais tarde."
            })
        }
    }

    async deletar (req, res) {
        try {
            const codProduto = req.body.codProduto
            await produtoService.deletarProduto(codProduto)
            return res.status(200).json({message: "Sucesso ao deletar o produto!"})
        } catch (err) {
            console.error("Erro ao deletar o produto: ", err)
            const statusCode = err.statusCode || 500
            return res.status(statusCode).json({
                error: "Erro ao deletar o produto, tente novamente mais tarde."
            })
        }
    }

    async listarComFiltro(req, res) {
        // Verificação para presença de chaves
        if (Object.keys(req.query).length === 0) {
            return this.listarProdutos(req, res)
        }
        try {
            const produtos = await produtoService.listarProdutosFiltro(req.query)
            return res.status(200).json(produtos)
        } catch (err) {
            console.error("Erro ao listar os produtos com filtro: ", err)
            const statusCode = err.statusCode || 500
            return res.status(statusCode).json({
                error: "Erro ao listar os produtos com filtro, tente novamente mais tarde."
            })
        }
    }

    async listarProdutos(req,res) {
        try {
            const produtos = await produtoService.listarProdutosTodos()
            return res.status(200).json(produtos)
        } catch (err) {
            console.error("Erro ao listar os produtos: ", err);
            const statusCode = err.statusCode || 500
            return res.status(statusCode).json({
                error: "Erro ao listar os produtos, tente novamente mais tarde."
            })
        }
    }
}

module.exports = new ProdutoController();