// Importa o service que contém a lógica de negócio
const produtoService = require('../services/produto.service');

// Define a classe do Controller
// Controllers são responsáveis por receber requisições HTTP e retornar respostas
class ProdutoController {
    
    // Método assíncrono para criar um produto
    // Recebe os objetos req (requisição) e res (resposta) do Express
    async cadastrar(req, res) {
        
        // Bloco try-catch para capturar erros
        try {
            // Chama o método criarProduto do service
            // req.body contém os dados enviados no corpo da requisição
            // O service faz toda a validação e criação no banco
            const novoProduto = await produtoService.criarProduto(req.body);
            
            // Se deu tudo certo, retorna status 201 (Created)
            // e envia o produto criado como JSON
            return res.status(201).json(novoProduto);
            
        } catch (error) {
            // Se algum erro foi lançado pelo service, cai aqui
            
            // Pega o statusCode do erro (se existir) ou usa 500 como padrão
            // 400 = erro do cliente (validação)
            // 500 = erro do servidor (problema interno)
            const statusCode = error.statusCode || 500
            
            // Retorna a resposta de erro com o status apropriado
            return res.status(statusCode).json({
                // Sempre inclui a mensagem de erro
                error: error.message,
                
                // Operador spread (...) com condição:
                // Se error.camposFaltando existir, adiciona ao objeto
                // Isso mostra quais campos obrigatórios faltaram
                ...(error.camposFaltando && { camposFaltando: error.camposFaltando }),
                
                // Se error.detalhes existir, adiciona ao objeto
                // Isso mostra detalhes de erros de validação do Sequelize
                ...(error.detalhes && { detalhes: error.detalhes })
            });
        }
    }

    async consultarPorId (req, res) {
        try {
            const codProduto = req.params.id
            const produto = produtoService.buscarProdutoPorId(codProduto)
            return res.status(200).json(produto)
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                error: error.message
            });
        }
    }

    async atualizar (req, res) {
        try {
            const valores = req.body
            const produtoCad = produtoService.atualizarProduto(valores)
            return res.status(200).json(produtoCad)
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                error: error.message,
                ...(error.camposFaltando && { camposFaltando: error.camposFaltando }),
                ...(error.detalhes && { detalhes: error.detalhes })
            });
        }
    }

    async deletar (req, res) {
        try {
            const codProduto = req.body.codProduto
            await produtoService.deletarProduto(codProduto)
            return res.status(200).json({message: "Sucesso ao deletar o produto!"})
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                error: "Erro ao deletar o produto."
            });
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
        } catch (error) {
            const statusCode = error.statusCode || 500
            return res.status(statusCode).json({
                error: "Erro ao listar os produtos."
            })
        }
    }

    async listarProdutos(req,res) {
        try {
            const produtos = await produtoService.listarProdutosTodos()
            return res.status(200).json(produtos);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({
                error: "Erro ao listar os produtos."
            });
        }
    }
}

module.exports = new ProdutoController();