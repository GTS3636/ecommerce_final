const express = require("express")
const router = express.Router()

const usuarioController = require("../controller/usuario.controller")
const authMiddleware = require("../middleware/authMiddleware")
const isAdminMiddleware = require("../middleware/isAdmin.middleware")

// Pronto
router.post("/cadastrar", usuarioController.cadastrar)

// Pronto
// router.get("/listar", authMiddleware, isAdminMiddleware, usuarioController.listar)
router.get("/listar", usuarioController.listar)

// Pronto
// router.get("/consultar/:nome", authMiddleware, isAdminMiddleware, usuarioController.consultar)
router.get("/consultar/:nome", usuarioController.consultar)

// Ideia para futuro
// router.get("/filtro", usuarioController.listarComFiltro)

// Pronto
// router.put("/atualizar", authMiddleware, isAdminMiddleware, usuarioController.atualizar)
router.put("/atualizar", usuarioController.atualizar)

// Pronto
// router.delete("/deletar/:id", authMiddleware, isAdminMiddleware, usuarioController.deletar)
router.delete("/deletar/:id", usuarioController.deletar)

module.exports = router