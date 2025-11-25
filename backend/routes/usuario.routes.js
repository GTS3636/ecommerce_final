const express = require("express")
const router = express.Router()

const usuarioController = require("../controller/usuario.controller")

//Finalizado
router.post("/cadastrar", usuarioController.cadastrar)
// Finalizado
router.get("/listar", usuarioController.listarUsuarios)
// Finalizado
router.get("/filtro", usuarioController.listarComFiltro)
// Finalizado
router.put("/atualizar", usuarioController.atualizar)
// Finalizado
router.delete("/deletar/:id", usuarioController.deletar)

module.exports = router