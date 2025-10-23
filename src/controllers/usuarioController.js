import UsuarioModel from "../models/Usuarios.js";

export const getAllUsuarios = async (req, res, next) => {
  try {
    const usuarios = await UsuarioModel.getAll();

    if (usuarios.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No se encontraron usuarios'
      });
    }

    res.status(200).json({
      status: 200,
      data: usuarios
    });
  } catch (error) {
    next(error);
  }
};

export const createUsuario = async (req, res, next) => {
  const usuarioData = req.body;
  try {
    const newUsuario = await UsuarioModel.create(usuarioData);
    res.status(201).json({
      status: 201,
      data: newUsuario
    });
  } catch (error) {
    next(error);
  }
}