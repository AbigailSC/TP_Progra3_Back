import TipoModel from '../models/Tipo.js';

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

export const getTipoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tipoById = await TipoModel.getById(id);

    if (!tipoById) {
      return res.status(404).json({
        status: 404,
        message: 'Tipo no encontrado'
      });
    }

    res.status(200).json({
      status: 200,
      data: tipoById
    });
  } catch (error) {
    next(error);
  }
};