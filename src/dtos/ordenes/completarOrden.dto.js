import { DaoFactory } from "../../daos/FactoryDao.js";
import { CompletarCarritoDTO } from "../carritos/completarCarrito.dto.js";

// const productosDAO = DaoFactory.getProductosDao();
const carritosDAO = DaoFactory.getCarritosDao();
// const ordenesDAO = DaoFactory.getOrdenesDao();
const usuariosDAO = DaoFactory.getUsuariosDao();

export class completarOrdenDTO {
  constructor(ordenId, usuarioId, carritoId, timeStamp, estado) {
    this.ordenId = ordenId;
    this.usuarioId = usuarioId;
    this.usuarioData = {};
    this.carritoId = carritoId;
    this.carritoData = {};
    this.timeStamp = timeStamp;
    this.estado = estado;
  }
  async completeData() {
    // completa usuarioData
    const userObj = await usuariosDAO.readById(this.usuarioId)
    this.usuarioData = userObj

    // completa carritoData
    const carritoObj = await carritosDAO.readById(this.carritoId)
    const carritoCompleto = new CompletarCarritoDTO(carritoObj.usuarioId);
    const { arrayProdData, subTotal } =
    await carritoCompleto.calculateProductsDataAndSubtotal(carritoObj._id);

    this.carritoData = carritoObj
    this.carritoData.productos = arrayProdData
    this.carritoData.subTotal = subTotal

    return this;
  }
}
