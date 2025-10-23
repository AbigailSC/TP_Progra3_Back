import pool from '../config/database.js';

export const getAll = async () => {
  const [results] = await pool.query('SELECT * FROM tipos');
  return results;
};

export const getById = async (id) => {
  const [results] = await pool.query('SELECT * FROM tipos WHERE id = ?', [id]);
  return results[0];
};