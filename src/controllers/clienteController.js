import { validateCliente } from '../utils/validations.js';

export const createCliente = async (req, res, next) => {
  try {
    const clienteData = req.body;
    const errors = validateCliente(clienteData);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors
      });
    }
    const newCliente = await ClienteModel.create(clienteData);
    res.status(201).json({
      status: 201,
      data: newCliente
    });
  } catch (error) {
    next(error);
  }
}