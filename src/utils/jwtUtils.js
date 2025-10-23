import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'coso_123';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const generateToken = (payload) => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return token;
  } catch (error) {
    throw new Error('Error al generar el token');
  }
}

export const verifyToken = (token) => {
  try {
    if (!token) {
      throw new Error('Token no proporcionado');
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}