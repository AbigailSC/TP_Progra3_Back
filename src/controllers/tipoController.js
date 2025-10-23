import * as TipoModel from '../models/Tipo.js';

export const getAllTipos = async (req, res) => {
  try {
    const tipos = await TipoModel.getAll();

    if (tipos.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No se encontraron tipos'
      });
    }

    res.status(200).json({
      status: 200,
      data: tipos
    });
  } catch (error) {
    next(error);
  }
};