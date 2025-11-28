const express = require("express")
const router = express.Router()

const produtoController = require("../controller/produto.controller")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/isAdmin.middleware")

// Pronto
router.post("/cadastrar",  authMiddleware, adminMiddleware, produtoController.cadastrar)

// Pronto
router.put("/atualizar",  authMiddleware, adminMiddleware, produtoController.atualizar)

// Pronto
router.get("/listar", authMiddleware, adminMiddleware, produtoController.listar)

// Endpoint para homepage - apenas produtos ativos com estoque > 0
router.get("/homepage", produtoController.listarHomepage)

// Pronto
router.get("/consultar/:id", produtoController.consultar)

// Pronto
router.delete("/deletar/:id",  authMiddleware, adminMiddleware, produtoController.deletar)

module.exports = router