const express = require("express")
const router = express.Router()

const usuarioController = require("../controller/usuario.controller")


router.post("/cadastrar", usuarioController.cadastrar)

router.get("/listar", usuarioController.listar)
// Ideia para futuro
// router.get("/filtro", usuarioController.listarComFiltro)

router.put("/atualizar", usuarioController.atualizar)

router.delete("/deletar/:id", usuarioController.deletar)

module.exports = router