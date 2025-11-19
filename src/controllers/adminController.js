import * as XLSX from 'xlsx';

import VentaModel from '../models/Venta.js';
import ProductoModel from '../models/Producto.js'
import TipoModel from '../models/Tipo.js'

import { sendResponse } from '../utils/customResponse.js';

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

export const getAllProductos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orderBy = req.query.order_by || 'id';
    const order = req.query.order || 'ASC';

    const filters = {
      id_tipo: req.query.tipo ? parseInt(req.query.tipo) : null,
      search: req.query.buscar || null,
      activo: req.query.activo !== undefined ? req.query.activo === 'true' : null,
      orderBy,
      order
    };

    const { productos, total } = await ProductoModel.getProductosPaginated(page, limit, filters);

    const tipos = await TipoModel.getAll();
    const totalPages = Math.ceil(total / limit);

    res.render('productos', {
      productos,
      tipos,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: req.query
    });
  } catch (error) {
    next();
  }
}

export const exportVentas = async (req, res, next) => {
  try {
    const ventas = await VentaModel.getAll();

    const dataExcel = ventas.map((venta) => ({
      'ID': venta.id,
      'Cliente': venta.cliente || 'Invitado',
      'Total': Number(venta.total).toFixed(2),
      'Estado': venta.estado,
      'Metodo Pago': venta.metodo_pago,
      'Notas': venta.notas,
      'Fecha de creacion': new Date(venta.created_at).toLocaleDateString('es-AR'),
      'Fecha de modificacion': new Date(venta.updated_at).toLocaleDateString('es-AR')
    }));
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(dataExcel);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');

    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx'
    });

    const fecha = new Date().toISOString().split('T')[0];

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=productos_${fecha}.xlsx`
    );

    res.send(excelBuffer);
  } catch (error) {
    next();
  }
}

export const login = async (req, res, next) => {
  try {
    res.render('login');
  } catch (error) {
    next();
  }
}

export const dashboard = async (req, res, next) => {
  try {
    const totalVentasMesActual = await VentaModel.getTotalVentasMesActual();
    const totalVentasMesPasado = await VentaModel.getVentasMesAnterior();

    const diferencia = totalVentasMesActual.total_vendido - totalVentasMesPasado.total_vendido;
    let porcentaje;
    if (totalVentasMesPasado.cantidad_ventas == 0) {
      porcentaje = 100;
    } else {
      porcentaje = (diferencia / totalVentasMesPasado.total_vendido) * 100
    }

    const ventas_mes = {
      total: totalVentasMesActual.total_vendido,
      variacion: porcentaje.toFixed(2) + '%',
      tipo: porcentaje >= 0 ? "aumento" : "descuento",
      diferencia
    }

    res.render('dashboard', { ventas_mes });
  } catch (error) {
    next();
  }
}