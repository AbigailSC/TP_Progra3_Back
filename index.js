import 'dotenv/config';
import mysql from 'mysql2/promise';
import express from 'express';

const connection = mysql.createPool({
  host: process.env.DB_HOST || 'mysql_db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'test_password',
  database: process.env.DB_NAME || 'autoservicio_db',
  port: process.env.DB_PORT || 3306
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Test BD
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM tipos');
    console.log('✅ Conexión exitosa:', rows);
    res.json({ message: 'Conexión exitosa', data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error de conexión a BD' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
