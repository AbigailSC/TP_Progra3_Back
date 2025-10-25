import pool from '../config/database.js';

const UsuarioModel = {
  getAll: async () => {
    const [results] = await pool.query('SELECT * FROM usuarios');
    return results;
  },
  getById: async (id) => {
    const [results] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return results[0];
  },
  getByEmail: async (email) => {
    const [results] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return results[0];
  },
  create: async (usuario) => {
    const { nombre, email, password, admin = false } = usuario;

    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, admin) VALUES (?, ?, ?, ?)',
      [nombre, email, password, admin]
    );
    return { id: result.insertId, ...usuario };
  },
  update: async (id, usuario) => {
    const { nombre, password } = usuario;
    const [result] = await pool.query(
      'UPDATE usuarios SET nombre = ?, password = ? WHERE id = ?',
      [nombre, password, id]
    );
    return result;
  },
  delete: async (id) => {
    const result = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return result;
  }
};

export default UsuarioModel;