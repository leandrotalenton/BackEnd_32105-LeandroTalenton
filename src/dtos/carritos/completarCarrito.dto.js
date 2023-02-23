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
        // console.log("esto es el prod del DTO: ", prod)
        let data = await productosDAO.readById(prod.prodId);
        // console.log("la data del DTO es esto: ", data)
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
      const nameA = a.title.toUpperCase(); // ignore upper and lowercase
      const nameB = b.title.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    console.log("asi queda el arrayProdData: ", this.arrayProdData);
    this.subTotal = this.arrayProdData.reduce(
      (pv, cv) => pv + Number(cv.subtotal),
      0
    );
    return this;
  }
}
