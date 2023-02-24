import { DaoFactory } from "../../daos/daoFactory.js";
import { carritoActivoByUserId } from "../../services/carritos.service.js";
const productosDAO = DaoFactory.getProductosDao();
const carritosDAO = DaoFactory.getCarritosDao();

export class CompletarCarritoDTO {
  constructor(userId) {
    this.userId = userId;
    this.arrayProdData = [];
    this.subTotal = 0;
  }
  async calculateProductsDataAndSubtotal() {
    const { productos } = await carritoActivoByUserId(this.userId);
    await Promise.all(
      productos.map(async (prod) => {
        let data = await productosDAO.readById(prod.prodId);
        data = {
          prodId: prod.prodId,
          cantidad: prod.cantidad,
          subtotal: prod.cantidad * Number(data.price),
          ...data._doc,
        };
        this.arrayProdData.push(data);
      })
    );
    this.arrayProdData.sort((a, b) => {
      const prodA = a.title.toUpperCase();
      const prodB = b.title.toUpperCase();
      if (prodA < prodB) return -1
      if (prodA > prodB) return 1
      return 0;
    });
    this.subTotal = this.arrayProdData.reduce(
      (pv, cv) => pv + Number(cv.subtotal),
      0
    );
    return this;
  }
}
