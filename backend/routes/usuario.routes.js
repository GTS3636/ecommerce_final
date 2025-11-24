const express = require("express")
const router = express.Router()

const usuarioController = require("../controller/usuario.controller")
const authMiddleware = require("../middleware/authMiddleware")
const isAdminMiddleware = require("../middleware/isAdmin.middleware")

// Pronto
router.post("/cadastrar", usuarioController.cadastrar)

// Pronto
router.get("/listar", authMiddleware, isAdminMiddleware, usuarioController.listar)

// Pronto
router.get("/consultar/:nome", authMiddleware, isAdminMiddleware, usuarioController.consultar)

// Ideia para futuro
// router.get("/filtro", usuarioController.listarComFiltro)

// Pronto
router.put("/atualizar", authMiddleware, isAdminMiddleware, usuarioController.atualizar)

// Pronto
router.delete("/deletar/:id", authMiddleware, isAdminMiddleware, usuarioController.deletar)

module.exports = router