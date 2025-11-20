class BaseService {
    // Validar campos obrigatórios
    validarCamposObrigatorios(dados, camposObrigatorios) {
        const camposFaltando = camposObrigatorios.filter(campo => 
            dados[campo] === undefined || 
            dados[campo] === null || 
            dados[campo] === ''
        );
            
        if (camposFaltando.length > 0) {
            const erro = new Error('Campos obrigatórios faltando.')
            erro.statusCode = 400
            erro.camposFaltando = camposFaltando
            throw erro
        }
    }
    
    // Validar tipo numérico positivo (para preço, quantidade, etc.)
    validarNumeroPositivo(valor, nomeCampo) {
        if (typeof valor !== 'number' || valor <= 0) {
            const erro = new Error(`${nomeCampo} deve ser um número maior que zero.`)
            erro.statusCode = 400
            throw erro
        }
    }
    
    // Listar com filtros opcionais
    async listarFiltrado(Classe, filtros = {}) {
        return await Classe.findAll({ where: filtros })
    }
    
    // Listar todos sem filtros
    async listarTodos(Classe) {
        return await Classe.findAll()
    }
    
    // Buscar por ID com tratamento de erro
    async buscarPorId(Classe, id, nomeEntidade = 'Registro') {
        const registro = await Classe.findByPk(id)
        
        if (!registro) {
            const erro = new Error(`${nomeEntidade} não encontrado.`)
            erro.statusCode = 404
            throw erro
        }
        
        return registro
    }

    async buscarPorFiltro(Classe, filtro, nomeEntidade = 'Registro') {
        // A variável filtro é esperada já em formato JSON com chave valor
        // Ex: {email: "ex@email.com"}
        const registro = await Classe.findOne({where:filtro})
        
        if (!registro) {
            const erro = new Error(`${nomeEntidade} não encontrado.`)
            erro.statusCode = 404
            throw erro
        }
        
        return registro
    }
    
    // Criar registro com validação do Sequelize
    async cadastrar(Classe, dados) {
        try {
            const novoRegistro = await Classe.create(dados)
            return novoRegistro
        } catch (error) {
            // Tratamento de erros do Sequelize
            if (error.name === 'SequelizeValidationError') {
                const erro = new Error('Erro de validação')
                erro.statusCode = 400;
                erro.detalhes = error.errors.map(e => e.message)
                throw erro
            }
            throw error
        }
    }
    
    // Atualizar registro
    async atualizar(Classe, id, dados, nomeEntidade = 'Registro') {
        const registro = await this.buscarPorId(Classe, id, nomeEntidade)
        
        try {
            await registro.update(dados)
            return registro
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const erro = new Error('Erro de validação')
                erro.statusCode = 400
                erro.detalhes = error.errors.map(e => e.message)
                throw erro
            }
            throw error
        }
    }
    
    // Deletar registro
    async deletar(Classe, id, nomeEntidade = 'Registro') {
        const registro = await this.buscarPorId(Classe, id, nomeEntidade)
        await registro.destroy()
        return { mensagem: `${nomeEntidade} deletado com sucesso!` }
    }
}

module.exports = BaseService