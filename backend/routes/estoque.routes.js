const express = require("express")
const router = express.Router()

const estoqueController = require("../controller/estoque.controller")

// 
router.put("/atualizar", estoqueController.atualizar)

// 
router.get("/listar", estoqueController.listar)

// 
router.get("/consultar/:id", estoqueController.consultar)

module.exports = router