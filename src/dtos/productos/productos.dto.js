import { DaoFactory } from "../../daos/FactoryDao.js";
const productosDAO = DaoFactory.getProductosDao();

export class ProductosDTO {
  constructor() {
    this.arrayProdData = [];
  }
  async filterProductos(queryFilter) {
    const productos = await productosDAO.read();
    queryFilter
      ? (this.arrayProdData = productos.filter(
          (producto) => producto.category === queryFilter
        ))
      : (this.arrayProdData = productos);
    return this;
  }
}
