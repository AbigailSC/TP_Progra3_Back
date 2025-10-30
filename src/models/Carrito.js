import pool from '../config/database.js';

const CarritoModel = {
  create: async (id_cliente = null) => {
    const [result] = await pool.query(
      'INSERT INTO carritos (id_cliente) VALUES (?)',
      [id_cliente]
    );
    return result.insertId;
  },
  getActiveByCliente: async (id_cliente) => {
    const [rows] = await pool.query(
      'SELECT * FROM carritos WHERE id_cliente = ? AND estado = ? ORDER BY created_at DESC LIMIT 1',
      [id_cliente, 'activo']
    );
    return rows[0] || null;
  },
  updateEstado: async (carrito_id, estado) => {
    const [result] = await pool.query(
      'UPDATE carritos SET estado = ? WHERE id = ?',
      [estado, carrito_id]
    );
    return result.affectedRows > 0;
  }
}

export default CarritoModel;