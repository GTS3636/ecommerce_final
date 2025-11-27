const express = require("express")
const router = express.Router()

const itmePedidoController = require("../controller/item_pedido.controller")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/isAdmin.middleware")

// 
router.put("/atualizar", authMiddleware, adminMiddleware, itmePedidoController.atualizar)

// 
router.get("/listar", authMiddleware, adminMiddleware, itmePedidoController.listar)

module.exports = router