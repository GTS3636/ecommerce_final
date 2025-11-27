const express = require("express")
const router = express.Router()

const estoqueController = require("../controller/estoque.controller")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/isAdmin.middleware")

// 
router.put("/atualizar", authMiddleware, adminMiddleware, estoqueController.atualizar)

// 
router.get("/listar", authMiddleware, adminMiddleware, estoqueController.listar)

// 
router.get("/consultar/:id", authMiddleware, adminMiddleware, estoqueController.consultar)

module.exports = router