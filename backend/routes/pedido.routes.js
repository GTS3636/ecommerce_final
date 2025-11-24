const express = require("express")
const router = express.Router()

const pedidoController = require("../controller/pedido.controller")

// Pronto
router.post("/cadastrar", pedidoController.cadastrar)

// Pronto
router.put("/atualizar", pedidoController.atualizar)

// Pronto
router.get("/listar", pedidoController.listar)

// Pronto
router.get("/consultar/:id", pedidoController.consultar)

module.exports = router