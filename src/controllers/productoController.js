import ProductoModel from '../models/Producto.js';
import { validateCreateProducto, validateUpdateProducto } from '../utils/validations.js';
import { generateSKU } from '../utils/generateSKU.js';

export const createProducto = async (req, res, next) => {
  try {
    const productoData = req.body;
    const validationErrors = validateCreateProducto(productoData);
    productoData.sku = generateSKU(productoData.titulo, productoData.id_tipo);

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

export const updateProducto = async (req, res, next) => {
  try {
    const id = req.params;
    const productoData = req.body;
    const validationErrors = validateUpdateProducto(productoData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: validationErrors
      });
    }

    const updatedProducto = await ProductoModel.update(id, productoData);
    if (!updatedProducto) {
      return res.status(404).json({
        status: 404,
        message: 'Producto no encontrado'
      });
    }
    res.json({
      status: 200,
      data: updatedProducto
    });
  } catch (error) {
    next(error);
  }
}

export const uploadProductoImage = async (req, res, next) => {
  try {
    const { url_image } = req.body;
    const id = req.params;

    const updatedProducto = await ProductoModel.updateImage(id, url_image);
    res.json({
      status: 200,
      data: updatedProducto
    });
  } catch (error) {
    next(error);
  }
}