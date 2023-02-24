import { DaoFactory } from "../../daos/daoFactory.js";
const productosDAO = DaoFactory.getProductosDao();

export class ProductosDTO {
  constructor() {
    this.arrayProdData = [];
  }
  async filterProductos(queryFilter) {
    const productos = await productosDAO.read();
    this.arrayProdData = productos.filter() ///////////////////////////
    return this;
  }
}
