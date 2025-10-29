import pool from '../config/database.js';

const ClienteModel = {
  create: async (cliente) => {
    const campos = [];
    const valores = [];

    for (const [key, value] of Object.entries(cliente)) {
      if (value !== undefined) {
        campos.push(key);
        valores.push(value);
      }
    }
    const query = `INSERT INTO clientes (${campos.join(', ')}) VALUES (${campos.map(() => '?').join(', ')})`;
    const [result] = await pool.query(query, valores);

    return { id: result.insertId, ...cliente };
  }
};

export default ClienteModel;