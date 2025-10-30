import pool from '../config/database.js';

const CarritoItemsModel = {
  create: async (data) => {
    const { carritoId, productoId, cantidad } = data;

    const [producto] = await pool.query(
      'SELECT precio FROM productos WHERE id = ?',
      [productoId]
    );
    // !Cambiar validaciones a controller, recibir todo validado
    if (producto.length === 0) {
      throw new Error('Producto no encontrado');
    }

    const precioUnitario = producto[0].precio;
    const subtotal = precioUnitario * cantidad;

    const [existe] = await pool.query(
      'SELECT * FROM carrito_items WHERE id_carrito = ? AND id_producto = ?',
      [carritoId, productoId]
    );

    if (existe.length > 0) {
      const nuevaCantidad = existe[0].cantidad + cantidad;
      const nuevoSubtotal = precioUnitario * nuevaCantidad;

      await pool.query(
        'UPDATE carrito_items SET cantidad = ?, subtotal = ? WHERE id = ?',
        [nuevaCantidad, nuevoSubtotal, existe[0].id]
      );
      return { ...existe[0], cantidad: nuevaCantidad, subtotal: nuevoSubtotal };
    }
    else {
      const [result] = await pool.query(
        'INSERT INTO carrito_items (id_carrito, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
        [carritoId, productoId, cantidad, precioUnitario, subtotal]
      );
      return { id: result.insertId, carritoId, productoId, cantidad, precioUnitario, subtotal };
    }
  },
  getById: async (id) => {
    const [rows] = await pool.query(
      'SELECT ci.*, p.titulo, p.url_image FROM carrito_items ci JOIN productos p ON ci.id_producto = p.id WHERE ci.id_carrito = ?',
      [id]
    );
    return rows;
  },
  delete: async (id) => {
    const [result] = await pool.query(
      'DELETE FROM carrito_items WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },
  getTotal: async (id) => {
    const [rows] = await pool.query(
      'SELECT SUM(subtotal) AS total FROM carrito_items WHERE id_carrito = ?',
      [id]
    );
    return rows[0].total || 0;
  }
}

export default CarritoItemsModel;