import UsuarioModel from "../models/Usuarios.js";
import { sendResponse } from '../utils/customResponse.js';

export const getAllUsuarios = async (req, res, next) => {
  try {
    const usuarios = await UsuarioModel.getAll();
    if (usuarios.length === 0) {
      return sendResponse(res, 404, 'No se encontraron usuarios');
    }

    return sendResponse(res, 200, 'Usuarios obtenidos exitosamente', usuarios);
  } catch (error) {
    next(error);
  }
};

export const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioModel.getById(id);
    if (!usuario) {
      return sendResponse(res, 404, 'Usuario no encontrado');
    }
    return sendResponse(res, 200, 'Usuario obtenido exitosamente', usuario);
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
      return sendResponse(res, 404, 'Usuario no encontrado');
    }
    const updatedUsuario = await UsuarioModel.update(id, usuarioData);
    return sendResponse(res, 200, 'Usuario actualizado correctamente', updatedUsuario);
  } catch (error) {
    next(error);
  }
}

export const deleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioModel.getById(id);
    if (!usuario) {
      return sendResponse(res, 404, 'Usuario no encontrado');
    }
    await UsuarioModel.delete(id);
    return sendResponse(res, 200, 'Usuario eliminado correctamente');
  } catch (error) {
    next(error);
  }
}