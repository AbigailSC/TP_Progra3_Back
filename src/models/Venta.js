import pool from '../config/database.js';

const Venta = {
  create: async (data) => {
    const { idCarrito, idCliente = null, total, metodoPago, notas } = data;

    const [result] = await pool.query('INSERT INTO ventas(id_carrito, id_cliente, total, estado, metodo_pago, notas) VALUES(?,?,?,?,?,?)',
      [idCarrito, idCliente, total, 'pendiente', metodoPago, notas])

    return {
      id: result.insertId,
      id_carrito: idCarrito,
      id_cliente: idCliente,
      total,
      metodo_pago: metodoPago,
      notas,
      estado: 'pendiente'
    }
  },
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM ventas WHERE id = ?',
      [id])

    return rows[0] || null;
  },
  getAll: async () => {
    const [rows] = await pool.query(
      'SELECT * FROM ventas ORDER BY created_at DESC'
    );
    return rows;
  },
  getByCliente: async (idCliente) => {
    const [rows] = await pool.query(
      'SELECT * FROM ventas WHERE id_cliente = ? ORDER BY created_at DESC',
      [idCliente]
    );
    return rows;
  },
  getByIdWithItems: async (id) => {
    const [venta] = await pool.query(
      'SELECT * FROM ventas WHERE id = ?',
      [id]
    );

    if (venta.length === 0) return null;

    const [items] = await pool.query(
      `SELECT ci.*, p.titulo, p.url_image 
      FROM carrito_items ci 
      JOIN productos p ON ci.id_producto = p.id 
      WHERE ci.id_carrito = ?`,
      [venta[0].id_carrito]
    );

    return {
      ...venta[0],
      items
    };
  },
  updateEstado: async (id, estado) => {
    const [result] = await pool.query(
      'UPDATE ventas SET estado = ? WHERE id = ?',
      [estado, id]
    );
    return result.affectedRows > 0;
  },
  getByEstado: async (estado) => {
    const [rows] = await pool.query(
      'SELECT * FROM ventas WHERE estado = ? ORDER BY created_at DESC',
      [estado]
    );
    return rows;
  },
  getByDateRange: async (fechaInicio, fechaFin) => {
    const [rows] = await pool.query(
      `SELECT * FROM ventas 
      WHERE created_at BETWEEN ? AND ? 
      ORDER BY created_at DESC`,
      [fechaInicio, fechaFin]
    );
    return rows;
  },
  getTotalByPeriod: async (fechaInicio, fechaFin) => {
    const [rows] = await pool.query(
      `SELECT 
        COUNT(*) as cantidad_ventas,
        SUM(total) as total_vendido,
        AVG(total) as promedio_venta
        FROM ventas 
        WHERE created_at BETWEEN ? AND ? 
        AND estado != 'cancelado'`,
      [fechaInicio, fechaFin]
    );
    return rows[0];
  }
}

export default Venta;