const { Router } = require("express");
const router = Router();
const usuarios = require("./usuario.routes.js");
const transferencia = require("./transferencia.routes.js")



/* GET DE EJEMPLO  localhost:3000/   */
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});


/*definimos los endpoints en secciones */
router.use("/usuario", usuarios);
router.use("/transferencia", transferencia);


module.exports = router;
