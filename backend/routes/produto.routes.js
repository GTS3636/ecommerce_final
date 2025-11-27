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
router.get("/listar", produtoController.listar)

// Pronto
router.get("/consultar/:id", produtoController.consultar)

// Pronto
router.delete("/deletar/:id",  authMiddleware, adminMiddleware, produtoController.deletar)

module.exports = router