const { Router } = require("express");
const router = Router(); //localhost:3000/category
const { pool } = require("../db");
const {
  getUsuario,
  createUsuario,
  editUsuario,
  deleteUsuario,
} = require("../controllers/usuarios.controllers");

/* GET => CONSULTA */
router.get("/", getUsuario);

/* POST => CREAR */
router.post("/crear", createUsuario);

/* PATCH O PUT => EDITAR */
router.put("/editar", editUsuario);

/* DELETE => ELIMINAR */
router.delete("/borrar", deleteUsuario);

module.exports = router;
