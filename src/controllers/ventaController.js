import VentaModel from '../models/Venta.js';
import CarritoModel from '../models/Carrito.js';
import CarritoItemsModel from '../models/CarritoItems.js';
import { sendResponse } from '../utils/customResponse.js';
import { validateVentas } from '../utils/validations.js'

export const createVenta = async (req, res, next) => {
  try {
    const { idCarrito, metodoPago, notas = null } = req.body;
    const validationErrors = validateVentas(idCarrito, metodoPago, notas);

    if (validationErrors.length > 0) {
      return sendResponse(res, 400, 'Errores de validación', validationErrors);
    }

    const [carrito] = await CarritoModel.getById(idCarrito);

    if (!carrito) {
      return sendResponse(res, 404, 'No se encontro el carrito')
    }

    const total = await CarritoItemsModel.getTotal(idCarrito)

    const dataFormateada = {
      idCarrito,
      idCliente: carrito.id_cliente || null,
      total: parseFloat(total),
      metodoPago: metodoPago.toLowerCase(),
      notas
    }

    const newVenta = await VentaModel.create(dataFormateada);

    return sendResponse(res, 201, 'Venta cargada con exito', newVenta)
  } catch (error) {
    next(error)
  }
}

export const getVentaById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const venta = await VentaModel.getById(id);

    if (!venta) {
      return sendResponse(res, 404, 'Venta no encontrada');
    }

    return sendResponse(res, 200, 'Venta encontrada con exito', venta);
  } catch (error) {
    next(error);
  }
}

export const getAllVentas = async (req, res, next) => {
  try {
    const ventas = await VentaModel.getAll();
    return sendResponse(res, 200, 'Ventas encontradas con exito', ventas);
  } catch (error) {
    next(error);
  }
}