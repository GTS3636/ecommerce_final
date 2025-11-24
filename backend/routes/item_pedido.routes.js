const express = require("express")
const router = express.Router()

const itmePedidoController = require("../controller/item_pedido.controller")

// 
router.post("/cadastrar", itmePedidoController.cadastrar)

// 
router.put("/atualizar", itmePedidoController.atualizar)

// 
router.get("/listar", itmePedidoController.listar)

module.exports = router