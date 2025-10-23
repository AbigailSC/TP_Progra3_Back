import UsuarioModel from "../models/Usuarios.js";
import { hashPassword } from "../utils/passwordUtils.js";

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

export const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioModel.getById(id);
    if (!usuario) {
      return res.status(404).json({
        status: 404,
        message: 'Usuario no encontrado'
      });
    }
    res.status(200).json({
      status: 200,
      data: usuario
    });
  } catch (error) {
    next(error);
  }
}

export const updateUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioData = req.body;
    const usuario = await UsuarioModel.getById(id);
    if (!usuario) {
      return res.status(404).json({
        status: 404,
        message: 'Usuario no encontrado'
      });
    }
    const updatedUsuario = await UsuarioModel.update(id, usuarioData);
    res.status(200).json({
      status: 200,
      data: updatedUsuario
    });
  } catch (error) {
    next(error);
  }
}

export const deleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioModel.getById(id);
    if (!usuario) {
      return res.status(404).json({
        status: 404,
        message: 'Usuario no encontrado'
      });
    }
    await UsuarioModel.delete(id);
    res.status(200).json({
      status: 200,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
}