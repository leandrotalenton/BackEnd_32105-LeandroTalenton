import { ContainerMongoDb } from "../../containers/ContainerMongoDb.js";

class DAOUsuariosMongo extends ContainerMongoDb {
  constructor() {
    super("usuarios", {
      username: { type: String, required: true },
      password: { type: String, required: true },
      rank: { type: Number, required: true, default: 0 }, // 0 usuario, 1 mod, 2 admin
      email: { type: String, required: true },
      age: { type: Number, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      pic: { type: String, required: true }
    });
  }
}
export default DAOUsuariosMongo;
