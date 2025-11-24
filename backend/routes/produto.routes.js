const express = require("express")
const router = express.Router()

const produtoController = require("../controller/produto.controller")

router.post("/produto", produtoController.cadastrar)
router.put("/produto", produtoController.atualizar)
router.get("/produto", produtoController.listar)
router.get("/produto/:id", produtoController.consultar)
router.delete("/produto/:id", produtoController.deletar)

module.exports = router