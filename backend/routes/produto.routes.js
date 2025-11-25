const express = require("express")
const router = express.Router()

const produtoController = require("../controller/produto.controller")

//Finalizado
router.post("/cadastrar", produtoController.cadastrar)
// Finalizado
router.get("/listar", produtoController.listarProdutos)
// Finalizado
router.get("/filtro", produtoController.listarComFiltro)
// 
router.put("/atualizar", produtoController.atualizar)
// 
router.delete("/deletar/:id", produtoController.deletar)

module.exports = router