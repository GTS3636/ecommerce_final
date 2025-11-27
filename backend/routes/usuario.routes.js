const express = require("express")
const router = express.Router()

const usuarioController = require("../controller/usuario.controller")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/isAdmin.middleware")

// Pronto
router.post("/cadastrar", usuarioController.cadastrar)

// Pronto
// router.get("/listar", authMiddleware, isAdminMiddleware, usuarioController.listar)
router.get("/listar",  authMiddleware, adminMiddleware, usuarioController.listar)

// Pronto
// router.get("/consultar/:nome", authMiddleware, isAdminMiddleware, usuarioController.consultar)
router.get("/consultar/:nome",  authMiddleware, adminMiddleware, usuarioController.consultar)

// Pronto
router.put("/atualizar", authMiddleware, adminMiddleware, usuarioController.atualizar)

// Pronto
router.delete("/deletar/:id", authMiddleware, adminMiddleware, usuarioController.deletar)

module.exports = router