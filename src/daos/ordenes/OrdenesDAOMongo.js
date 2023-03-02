import { ContainerMongoDb } from "../../containers/ContainerMongoDb.js";

class DAOOrdenesMongo extends ContainerMongoDb {
  constructor() {
    super("ordenes", {
      usuarioId: { type: String, required: true },
      carritoId: { type: String, required: true },
      timeStamp: { type: String, required: true },
      estado: {type: String, required: true, default: "generada"},
    });
  }
}
export default DAOOrdenesMongo;
