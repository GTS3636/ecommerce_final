const BaseService = require('./base.service');
const Produto = require('../models/Produto');

class ProdutoService extends BaseService {
    
    async criarProduto(dados) {
        // Campos obrigatórios específicos de Produto
        const camposObrigatorios = [
            'nome', 'preco', 'imagem_url', 
            'ativo', 'especificacoes', 'categoria'
        ]
        this.validarCamposObrigatorios(dados, camposObrigatorios)
        
        // Validações específicas de Produto
        this.validarNumeroPositivo(dados.preco, 'Preço')

        return await this.cadastrar(Produto, dados)
    }
    
    async listarProdutosFiltro(filtros = {}) {
        return await this.listarFiltrado(Produto, filtros)
    }

    async listarProdutosTodos() {
        return await this.listarTodos(Produto)
    }
    
    async buscarProdutoPorId(id) {
        return await this.buscarPorId(Produto, id, 'Produto')
    }
    
    async atualizarProduto(id, dados) {
        // Validações se necessário
        if (dados.preco !== undefined || dados.preco !== null) {
            this.validarNumeroPositivo(dados.preco, 'Preço')
        }
        return await this.atualizar(Produto, id, dados, 'Produto')
    }
    
    async deletarProduto(id) {
        return await this.deletar(Produto, id, 'Produto')
    }
}

module.exports = new ProdutoService()