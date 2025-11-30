const express = require("express")
const router = express.Router()

const entregaController = require("../controller/entrega.controller")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/isAdmin.middleware")


// 
router.post("/cadastrar", authMiddleware, adminMiddleware, entregaController.cadastrar)

// 
router.put("/atualizar", authMiddleware, adminMiddleware, entregaController.atualizar)

// 
router.get("/listar", authMiddleware, adminMiddleware, entregaController.listar)

// 
router.get("/consultar/:id", authMiddleware, adminMiddleware, entregaController.consultar)

router.post("/frete", entregaController.calcularFreteCheckout)

module.exports = router