import UsuarioModel from '../models/Usuarios.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { generateToken } from '../utils/jwtUtils.js';
import { validateLogin, validateRegister } from '../utils/validations.js';

export const login = async (req, res, next) => {
  try {
    const loginData = req.body;
    const validationErrors = validateLogin(loginData);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: validationErrors
      });
    }

    const usuario = await UsuarioModel.getByEmail(loginData.email);
    if (!usuario) {
      return res.status(401).json({ status: 401, message: 'Credenciales inválidas' });
    }

    const isValidPassword = await comparePassword(loginData.password, usuario.password);
    if (!isValidPassword) {
      return res.status(401).json({ status: 401, message: 'Credenciales inválidas' });
    }

    const token = generateToken({ id: usuario.id })

    res.json({ status: 200, message: 'Login exitoso', token });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;
    const usuario = await UsuarioModel.getById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
    }
    res.json({ status: 200, data: usuario });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const usuarioData = req.body;
    const validationErrors = validateRegister(usuarioData);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: validationErrors
      });
    }
    const userExists = await UsuarioModel.getByEmail(usuarioData.email);
    if (userExists) {
      return res.status(400).json({
        status: 400,
        message: 'El correo electrónico ya está en uso'
      });
    }

    const passwordHashed = await hashPassword(usuarioData.password);
    usuarioData.password = passwordHashed;

    const newUsuario = await UsuarioModel.create(usuarioData);
    res.status(201).json({
      status: 201,
      data: newUsuario
    });
  } catch (error) {
    next(error);
  }
}
