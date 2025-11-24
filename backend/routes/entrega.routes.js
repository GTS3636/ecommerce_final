const express = require("express")
const router = express.Router()

const entregaController = require("../controller/entrega.controller")

// 
router.post("/cadastrar", entregaController.cadastrar)

// 
router.put("/atualizar", entregaController.atualizar)

// 
router.get("/listar", entregaController.listar)

// 
router.get("/consultar/:id", entregaController.consultar)

module.exports = router