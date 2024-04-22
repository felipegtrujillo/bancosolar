const { pool } = require("../db");

const postTransfer = async (req, res) => {
    try {

    const emisorID = req.body.emisor;
    const receptorID = req.body.receptor;
    const monto = req.body.monto;
    const fecha = new Date();

    console.log("START TRANSACTION");
    await pool.query("START TRANSACTION"); 


    let clienteDescontado, clienteAcreditado;

    try {
      const descontar = "UPDATE usuarios SET balance = balance - $2 WHERE id = $1 RETURNING *";
      let values = [emisorID, monto];
      clienteDescontado = await pool.query(descontar, values);
    } catch (errorDescontar) {
      console.error("Error al descontar:", errorDescontar);
      throw new Error("Error al descontar el monto del emisor, verifique el saldo");
    }

    try {
      const acreditar = "UPDATE usuarios SET balance = balance + $2 WHERE id = $1 RETURNING *";
      values = [receptorID, monto];
      clienteAcreditado = await pool.query(acreditar, values);
    } catch (errorAcreditar) {
      console.error("Error al acreditar:", errorAcreditar);

      throw new Error("Error al acreditar el monto al receptor");
    }

    if (!clienteAcreditado.rowCount || !clienteDescontado.rowCount) {
      const rollback = "ROLLBACK";
      await pool.query(rollback);
      console.log({
        status: "Error",
        message: "La operación ha sido anulada",
        code: 500,
        emisor: clienteDescontado.rows[0],
        receptor: clienteAcreditado.rows[0],
      });
      res.status(500).json({status:"Anulada", mensaje: "rollback"});
    } else {
      const queryTransfer = "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, $4) RETURNING *";
      values = [emisorID, receptorID, monto, fecha];
      const result = await pool.query(queryTransfer, values);
      
        console.log({
          status: "Ok",
          message: "Operación realizada con éxito.",
          code: 200,
          emisor: clienteDescontado.rows[0],
          receptor: clienteAcreditado.rows[0],
        });
        res.status(200).json({status:"200", data: result.rows});
        await pool.query("COMMIT");
        console.log("COMMIT");
        await pool.query("END TRANSACTION");
        console.log("END TRANSACTION")
      }
    } catch (error) {
      console.error(error);
      res.status(400).send({status:"400" ,mensaje: error.message});
    }
  };


  const getTransfer = async (req, res) => {
    try {
        let result = await pool.query("SELECT * FROM transferencias;");
        res.status(200).json({status:"ok", data: result.rows});
      } catch (error) {
        console.error(error);
        res.status(400).send("Error buscando las transferencias realizadas");
      }
  };

module.exports = {
    getTransfer,
    postTransfer,
  };