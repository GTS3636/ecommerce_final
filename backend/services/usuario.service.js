const Usuario = require('../models/Usuario')
const BaseService = require('./base.service')
const { validaEmail, validaTelefone, validaCPF } = require('../utils/validacao')
const { hashSenha } = require('../utils/criptografia')

class UsuarioService extends BaseService {
    async criarUsuario(dados) {
        const { nome, email, telefone, cpf, identidade, senha, tipo_usuario } = dados

        // -------- validações --------
        // Campos obrigatórios
        const camposObrigatorios = [
            'nome', 'email', 'senha', 'telefone', 
            'cpf', 'tipo_usuario'
        ];

        await this.validarCamposObrigatorios(dados, camposObrigatorios)

        if (!validaEmail(email)) {
            return new Error('Email inválido')
        }

        if (!validaTelefone(telefone)) {
            return new Error('Telefone inválido')
        }

        if (!validaCPF(cpf)) {
            return new Error('CPF inválido')
        }

        const usuarioEmail = await Usuario.findOne({ where: { email } })
        if (usuarioEmail) {
            return new Error('Email já está cadastrado')
        }

        const usuarioCPF = await Usuario.findOne({ where: { cpf } })
        if (usuarioCPF) {
            return new Error('CPF já está cadastrado')
        }

        // -------- criptografar senha --------
        const senhaBcrypt = await hashSenha(senha)

        // -------- criar no banco --------
        let valores = {
            nome,
            email,
            telefone,
            cpf,
            identidade,
            senha: senhaBcrypt,
            tipo_usuario
        }
        const novoUsuario = await this.cadastrar(Usuario, valores)

        return novoUsuario
    }
    async listarUsuariosTodos() {
        return await this.listarTodos(Usuario)
    }
    async listarUsuariosFiltro(filtros = {}) {
        return await this.listarFiltrado(Usuario, filtros)
    }
    async atualizarUsuario(dados) {
        return await this.atualizar(Usuario, dados.codUsuario, dados, "Usuário")
    }
    async deletarUsuario(codUsuario) {
        return await this.deletar(Usuario, codUsuario, "Usuário")
    }
}

module.exports = new UsuarioService()
