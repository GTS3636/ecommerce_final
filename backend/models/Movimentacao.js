const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Movimentacao = db.define('Movimentacao',{
    codMovimentacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idProduto: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Garante o relacionamento 1:1
        references: {
            model: 'produtos', 
            key: 'codProduto'  
        }
    },
    quantidade_atual: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0 // Saldo atual do item no Movimentacao
    },
    quantidade_minima: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0 // Quantidade mínima
    }
},{
    timestamps: true, 
    tableName: 'Movimentacaos'
})

module.exports = Movimentacao