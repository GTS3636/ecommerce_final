const { Op } = require("sequelize")
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
            return erro
        }
    }
    
    // Validar tipo numérico positivo (para preço, quantidade, etc.)
    validarNumeroPositivo(valor, nomeCampo) {
        if (typeof valor !== 'number' || valor <= 0) {
            const erro = new Error(`${nomeCampo} deve ser um número maior que zero.`)
            erro.statusCode = 400
            return erro
        }
    }
    
    // Listar com filtros opcionais
    async listarFiltrado(Classe, filtros = {}) {
        console.log("Filtro: ", filtros)
        // Extração das chaves e valores para pesquisa mais dinâmica
        // filtros vem como objeto, por isso podemos usar as duas funções abaixo
        const valorFiltro = Object.values(filtros)
        const headFiltro = Object.keys(filtros)

        let search = {}
        // Construindo o objeto dinamicamente
        headFiltro.forEach((head, index) => {
            search[head] = {
                [Op.like]: `%${valorFiltro[index]}%`
            }
        })
        return await Classe.findAll({ where: search })
    }
    
    // Listar todos sem filtros
    async listarTodos(Classe) {
        return await Classe.findAll()
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
                return erro
            }
        }
    }

    async buscarPorId(Classe, id, nomeEntidade = 'Registro') {
        try {
            const registro = await Classe.findByPk(id)

            if (!registro) {
                const erro = new Error(`${nomeEntidade} não encontrado`)
                erro.statusCode = 404
                return erro
            }

            return registro
        } catch (error) {
            const erro = new Error('Erro de validação')
            erro.statusCode = 400
            erro.detalhes = error.errors.map(e => e.message)
            return erro
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
                return erro
            }
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