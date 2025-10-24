import ProductoModel from '../models/Producto.js';
import { validateCreateProducto } from '../utils/validations.js';

export const createProducto = async (req, res, next) => {
  try {
    const productoData = req.body;
    const validationErrors = validateCreateProducto(productoData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: validationErrors
      });
    }

    const newProducto = await ProductoModel.create(productoData);
    res.status(201).json({
      status: 201,
      data: newProducto
    });
  } catch (error) {
    next(error);
  }
}