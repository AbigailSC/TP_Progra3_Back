import ProductoModel from '../models/Producto.js';
import { validateCreateProducto, validateUpdateProducto } from '../utils/validations.js';
import { generateSKU } from '../utils/generateSKU.js';
import { validatePaginationParams, validateOrderBy, validateOrder, PRODUCTO_ORDER_FIELDS } from '../utils/pagination.js';

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

export const deleteProducto = async (req, res, next) => {
  try {
    const id = req.params;
    const deleted = await ProductoModel.delete(id);
    if (!deleted) {
      return res.status(404).json({
        status: 404,
        message: 'Producto no encontrado'
      });
    }
  } catch (error) {
    next(error);
  }
}

export const getProductoById = async (req, res, next) => {
  try {
    const id = req.params;
    const producto = await ProductoModel.getById(id);
    if (!producto) {
      return res.status(404).json({
        status: 404,
        message: 'Producto no encontrado'
      });
    }
    res.json({
      status: 200,
      data: producto
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

export const getAllProductos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const validation = validatePaginationParams(page, limit);

    if (!validation.isValid) {
      return res.status(400).json({
        status: 400,
        message: 'Parámetros de paginación inválidos',
        errors: validation.errors
      });
    }

    const orderBy = validateOrderBy(req.query.order_by, PRODUCTO_ORDER_FIELDS);
    const order = validateOrder(req.query.order);

    const filters = {
      id_tipo: req.query.tipo ? parseInt(req.query.tipo) : null,
      search: req.query.buscar || null,
      precio_min: req.query.precio_min ? parseFloat(req.query.precio_min) : null,
      precio_max: req.query.precio_max ? parseFloat(req.query.precio_max) : null,
      orderBy: orderBy,
      order: order
    };

    const { productos, total } = await ProductoModel.getProductosPaginated(page, limit, filters);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      status: 200,
      data: productos,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage
      }
    })
  } catch (error) {
    next(error);
  }
}