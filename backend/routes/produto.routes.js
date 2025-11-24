const express = require("express")
const router = express.Router()

const produtoController = require("../controller/produto.controller")

// Pronto
router.post("/cadastrar", produtoController.cadastrar)

// Pronto
router.put("/atualizar", produtoController.atualizar)

// Pronto
router.get("/listar", produtoController.listar)

// Pronto
router.get("/consultar/:id", produtoController.consultar)

// Pronto
router.delete("/deletar/:id", produtoController.deletar)

module.exports = router