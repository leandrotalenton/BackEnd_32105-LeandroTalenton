import { CompletarCarritoDTO } from "../dtos/carritos/completarCarrito.dto.js";
import { completarOrdenDTO } from "../dtos/ordenes/completarOrden.dto.js";
import logger from "../loggers/configLog4JS.js";
import { getCompleteOrder, getFilteredUserOrders } from "../services/ordenes.service.js";

// devuelve todas las ordenes del usuario (id)
export const getUserOrders = async (req, res) => {
  try {
    const ordersArray = await getFilteredUserOrders(req.user._id);
    // res.send(ordersArray)
    res.render("./ordenes", {
      nombre: req.user.username,
      pic: req.user.pic,
      id: req.user.id,
      arrayDeOrdenes: ordersArray,
    });
  } catch (e) {
    logger.error(e);
  }
};

// muestra la informacion de la orden(id)
export const getOrderData = async (req, res) => {
  try {
    const ordenCompleta = await getCompleteOrder(req.params.id_orden);
    if(req.user._id.toString() === ordenCompleta.usuarioId){
      res.render("./orden", {
        nombre: req.user.username,
        pic: req.user.pic,
        id: req.user.id,
        ...ordenCompleta,
      });
    } else {
      res.send("esta orden no le corresponde a usted senior")
    }
  } catch (e) {
    logger.error(e);
  }
};
