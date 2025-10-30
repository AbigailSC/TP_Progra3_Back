import pool from '../config/database.js';

const Venta = {
  create: async (data) => {
    const { idCarrito, metodoPago, notas, total } = data;
    const [carrito] = await pool.query(
      'SELECT * FROM carritos WHERE id = ?',
      [idCarrito]
    );

    if (!carrito.length) {
      throw new Error('Carrito no encontrado');
    }


  }
}

export default Venta;