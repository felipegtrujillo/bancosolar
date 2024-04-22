const { Router } = require("express");
const router = Router(); 
const { pool } = require("../db");
const {
  getTransfer,
  postTransfer
} = require("../controllers/transferencias.controllers");

/* GET => CONSULTA */
 router.get("/", getTransfer); 

/* POST => CREAR */
router.post("/crear", postTransfer);

/* PATCH O PUT => EDITAR */

module.exports = router;
