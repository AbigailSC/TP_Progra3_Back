import VentaModel from '../models/Venta.js';

export const getAllVentas = async (req, res, next) => {
  try {
    let ventas = await VentaModel.getAll();
    // TODO agregar filtros y ordenamiento
    ventas = ventas.map((venta) => ({
      ...venta,
      metodo_pago: venta.metodo_pago.charAt(0).toUpperCase() + venta.metodo_pago.slice(1),
      estado: venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1),
      total: parseFloat(venta.total)
    }));

    res.render('ventas', { ventas });
  } catch (error) {
    next(error)
  }
}