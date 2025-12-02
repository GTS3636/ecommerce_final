const express = require("express")
const router = express.Router()

const pedidoController = require("../controller/pedido.controller")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/isAdmin.middleware")

// Pronto
router.post("/cadastrar", authMiddleware, pedidoController.cadastrar)

// Pronto
router.put("/atualizar", authMiddleware, adminMiddleware, pedidoController.atualizar)

// Pronto
router.get("/listar", authMiddleware, pedidoController.listar)

// Pronto
router.get("/consultar/:id", authMiddleware, pedidoController.consultar)

// Pronto
router.delete("/deletar/:id", authMiddleware, adminMiddleware, pedidoController.deletar)

module.exports = router