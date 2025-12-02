const express = require("express")
const router = express.Router()

const itmePedidoController = require("../controller/item_pedido.controller")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/isAdmin.middleware")

// 
router.put("/atualizar", authMiddleware, adminMiddleware, itmePedidoController.atualizar)

// 
router.get("/listar", authMiddleware, adminMiddleware, itmePedidoController.listar)

// Rota para cadastrar novo item de pedido
router.post("/cadastrar", authMiddleware, adminMiddleware, itmePedidoController.cadastrar)

// Rota para consultar item de pedido
router.get("/consultar/:id", authMiddleware, adminMiddleware, itmePedidoController.consultar)

// Rota para deletar item de pedido
router.delete("/deletar/:id", authMiddleware, adminMiddleware, itmePedidoController.deletar)

module.exports = router