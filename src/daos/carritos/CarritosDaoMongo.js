import { ContainerMongoDb } from "../../containers/ContainerMongoDb.js";

class DAOCarritosMongo extends ContainerMongoDb {
  constructor() {
    super("carritos", {
      usuarioId: { type: String, required: true },
      carritoActivo: { type: Boolean, required: true },
      productos: [
        {
          prodId: { type: String, required: true },
          cantidad: { type: Number, required: true },
        },
      ],
    });
  }
}

export default DAOCarritosMongo;
