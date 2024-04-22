const { pool } = require("../db");

/* GET => CONSULTAR */
const getUsuario = async (req, res) => {
  try {
    let result = await pool.query("SELECT * FROM usuarios;");

    res.status(200).json({status:"ok", data: result.rows});
  } catch (error) {
    console.error(error);
    res.status(400).send("Error buscando los usuarios");
  }
};


/* POST => CREAR */
const createUsuario = async (req, res) => {
  try {
/*   const {titulo, artista, tono } = req.body; */
    const values = [req.body.nombre, req.body.balance];
   
    const query = `INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *`;

    const result = await pool.query(query, values);
    res.status(200).json({status:"ok", data: result});
    console.log("usuario creado satisfactoriamente" ,result.rows);
  } catch (error) {
    console.error(error);
    res.status(400).send("Error al crear usuario");
  }
};

/* PATCH O PUT => EDITAR */
const editUsuario = async (req, res) => {
  try {
    
    const ID = req.query.id;
    const nombre = req.body.name;
    const balance = req.body.balance;

    let values = [ID, nombre, balance];

    let query = "UPDATE usuarios SET nombre = $2, balance = $3 WHERE id = $1 RETURNING *";

    const result = await pool.query(query, values);

    res.status(200).json();
    console.log("usuario editado satisfactoriamente" ,result.rows);
  } catch (error) {
    console.error(error);
    res.status(400).send("Error al editar el usuario");
  }
};

/* DELETE => ELIMINAR */
const deleteUsuario = async (req, res) => {
  try {
    const id = req.query.id;
    const values = [id];
    console.log("id es", id);

    let query = "DELETE FROM usuarios WHERE id = $1 RETURNING *";

    const result = await pool.query(query, values);

    res.status(200).json();
    console.log("usuario eliminado satisfactoriamente" ,result.rows);

  } catch (error) {
    console.error(error);
    res.status(400).send("Error al eliminar el usuario");
  }
};


module.exports = {
  getUsuario,
  createUsuario,
  editUsuario,
  deleteUsuario,
};
