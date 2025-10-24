import pool from '../config/database.js';

const ProductoModel = {
  create: async (producto) => {
    const { titulo, precio, stock, descripcion, sku, id_tipo, cliente_nombre } = producto;
    const [result] = await pool.query(
      'INSERT INTO productos (titulo, precio, stock, descripcion, sku, id_tipo, cliente_nombre) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, precio, stock, descripcion, sku, id_tipo, cliente_nombre]
    );
    return { id: result.insertId, ...producto };
  }
};

export default ProductoModel;