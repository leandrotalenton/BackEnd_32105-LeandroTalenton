import { DaoFactory } from "../daos/FactoryDao.js";
import { completarOrdenDTO } from "../dtos/ordenes/completarOrden.dto.js";
import logger from "../loggers/configLog4JS.js";

const ordenesDAO = DaoFactory.getOrdenesDao();

export async function getFilteredUserOrders(idUser) {
  try {
    const orders = await ordenesDAO.read();
    const userOrders = await orders.filter((order) => {
      return order.usuarioId == idUser;
    });
    return userOrders;
  } catch (e) {
    logger.error(e);
  }
}

export async function getCompleteOrder(idOrden) {
  try {
    const ordenObj = await ordenesDAO.readById(idOrden)
    const { _id: ordenId, usuarioId, carritoId, timeStamp, estado} = ordenObj
    const blankOrderObj = new completarOrdenDTO(ordenId, usuarioId, carritoId, timeStamp, estado); // aca le tengo que pasar varias cosas (ordenId, usuarioId, carritoId, timeStamp, estado)
    const ordenCompleta = await blankOrderObj.completeData();
    return ordenCompleta;
  } catch (e) {
    logger.error(e)
  }
}