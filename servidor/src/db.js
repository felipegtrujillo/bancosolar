const pg = require("pg");
const { Pool } = pg;

// ⚠ IMPORTO LA FUNCION DEL MODELO PARA SINCRONIZAR Y EVITAR MULTIPLES NEW SEQUELIZE EN CADA ARCHIVO

/* VARIABLES DE ENTORNO */
const USER_DB = "postgres";
const PASS_DB = "root";
const HOST_DB = "localhost";
const PORT_DB = "5432";
const NAME_DB = "bancosolar";

/* Inicio una instancia de sequelize y conecto con la base de datos */
const pool = new Pool({
  connectionString: `postgres://${USER_DB}:${PASS_DB}@${HOST_DB}:${PORT_DB}/${NAME_DB}`,
});

/* Exporto pool */
module.exports = { pool };
