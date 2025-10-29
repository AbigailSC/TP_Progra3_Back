import { validateCliente } from '../utils/validations.js';
import ClienteModel from '../models/Cliente.js';
import { sendResponse } from '../utils/customResponse.js';

export const createCliente = async (req, res, next) => {
  try {
    const clienteData = req.body;
    const errors = validateCliente(clienteData);
    if (errors.length > 0) {
      return sendResponse(res, 400, 'Errores de validación', errors);
    }
    const newCliente = await ClienteModel.create(clienteData);
    return sendResponse(res, 201, 'Cliente creado exitosamente', newCliente);
  } catch (error) {
    next(error);
  }
}