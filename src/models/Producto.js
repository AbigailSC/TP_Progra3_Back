import pool from '../config/database.js';

const ProductoModel = {
  create: async (producto) => {
    const { titulo, precio, stock, descripcion, sku, id_tipo, cliente_nombre } = producto;
    const [result] = await pool.query(
      'INSERT INTO productos (titulo, precio, stock, descripcion, sku, id_tipo, cliente_nombre) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, precio, stock, descripcion, sku, id_tipo, cliente_nombre]
    );
    return { id: result.insertId, ...producto };
  },
  update: async (id, producto) => {
    const campos = [];
    const valores = [];

    for (const [key, value] of Object.entries(producto)) {
      if (value !== undefined) {
        campos.push(`${key} = ?`);
        valores.push(value);
      }
    }

    if (campos.length === 0) {
      throw new Error('No se proporcionaron campos para actualizar');
    }

    valores.push(id);

    const query = `UPDATE productos SET ${campos.join(', ')} WHERE id = ?`;

    const [result] = await pool.query(query, valores);
    return result.affectedRows > 0 ? { id, ...producto } : null;
  }
};

export default ProductoModel;