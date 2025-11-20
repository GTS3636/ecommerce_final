const Usuario = require('../models/Usuario')
const BaseService = require('./base.service');
const { validaEmail, validaTelefone, validaCPF } = require('../utils/validacao')
const { hashSenha } = require('../utils/criptografia')

class UsuarioService extends BaseService {
    async criarUsuario(dados) {
        const { nome, email, telefone, cpf, identidade, senha, tipo_usuario } = dados

        // -------- validações --------
        // Campos obrigatórios
        const camposObrigatorios = [
            'nome', 'email', 'senha', 'telefone', 
            'cpf', 'identidade', 'tipo_usuario'
        ];

        this.validarCamposObrigatorios(dados, camposObrigatorios)

        if (!validaEmail(email)) {
            throw new Error('Email inválido')
        }

        if (!validaTelefone(telefone)) {
            throw new Error('Telefone inválido')
        }

        if (!validaCPF(cpf)) {
            throw new Error('CPF inválido')
        }

        const usuarioEmail = await Usuario.findOne({ where: { email } })
        if (usuarioEmail) {
            throw new Error('Email já está cadastrado')
        }

        const usuarioCPF = await Usuario.findOne({ where: { cpf } })
        if (usuarioCPF) {
            throw new Error('CPF já está cadastrado')
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
        const novoUsuario = this.cadastrar(Usuario, valores)

        return novoUsuario
    }
    async listarUsuariosTodos() {
        return this.listarTodos(Usuario)
    }
    async lisatrUsuariosFiltro(filtros = {}) {
        return this.listarFiltrado(Usuario, filtros)
    }
    async buscarUsuarioPorNome(nome) {
        return await this.buscarPorId(Usuario, nome)
    }
    async atualizarUsuario(dados) {
        return await this.atualizar(Usuario, dados.codUsuario, dados, "Usuário")
    }
    async deletarUsuario(dados) {
        return await this.deletar(Usuario, dados.codUsuario, "Usuário")
    }
}

module.exports = new UsuarioService()
