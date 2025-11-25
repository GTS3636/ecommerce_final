const { Op } = require("sequelize");
const { IGNORE } = require("sequelize/lib/index-hints");
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
            console.error("Erro: ",erro)
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
        try {
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
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const erro = new Error('Erro de validação')
                erro.statusCode = 400;
                erro.detalhes = error.errors.map(e => e.message)
                console.error("Erro: ",erro)
                return erro
            }
            console.error("Erro geral: ",error)
            return error
        }
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
                console.error("Erro: ",erro)
                return erro
            }
            console.error("Erro geral: ",error)
            return error
        }
    }

    async buscarPorId(Classe, id, nomeEntidade = 'Registro') {
        try {
            const registro = await Classe.findByPk(id)

            if (!registro) {
                const erro = new Error(`${nomeEntidade} não encontrado`)
                erro.statusCode = 404
                console.error(erro)
                return erro
            }

            return registro
        } catch (error) {
            console.error("Erro ao buscar por ID: ",error)
            return error
        }
    }
    
    // Atualizar registro
    async atualizar(Classe, id, dados, nomeEntidade = 'Registro') {
        const registro = await this.buscarPorId(Classe, id, nomeEntidade)
        if(!registro){
            return new Error("Não foi possível encontrar o registro pelo ID!")
        }
        try {
            await registro.update(dados)
            return registro
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const erro = new Error('Erro de validação')
                erro.statusCode = 400
                console.error(erro)
                return erro
            }
            console.error(error)
            return error
        }
    }
    
    // Deletar registro
    async deletar(Classe, id, nomeEntidade = 'Registro') {
        try {
            const registro = await this.buscarPorId(Classe, id, nomeEntidade)
            await registro.destroy()
            return { mensagem: `${nomeEntidade} deletado com sucesso!` }
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const erro = new Error('Erro de validação')
                erro.statusCode = 400
                console.error(erro)
                return erro
            }
            console.error(error)
            return error
        }
    }
}

module.exports = BaseService