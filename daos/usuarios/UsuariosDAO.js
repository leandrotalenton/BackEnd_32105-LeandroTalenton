import { ContainerMongoDb } from "../../containers/ContainerMongoDbNew.js";

class DAOUsuarios extends ContainerMongoDb {
  constructor() {
    super("usuarios", {
      username: { type: String, required: true },
      password: { type: String, required: true },
      rank: { type: Number, required: true, default: 0 }, // 0 usuario, 1 mod, 2 admin
      email: { type: String, required: true },
      age: { type: Number, required: true },
      phone: { type: String, required: true },
      pic: { type: String, required: true }
    });
  }
  async readByUsernameAndPassword(username, password) {
    try {
      const document = await this.db.findOne({$and: [
        {username: username},
        {password: password}
      ]})
      if (document) {
        return document
      }
    } catch (e) {
      console.log(e)
    }
  }
  async readByUsername(username) {
    try {
      const document = await this.db.findOne({username: username})
      if (document) {
        return document
      }
    } catch (e) {
      console.log(e)
    }
  }
  async updatePictureByUsername(username, path) {
    try {
      await this.db.updateOne({username: username}, { $set:{ pic: path }})
    } catch (e) {
      console.log(e)
    }
  }
}
export default DAOUsuarios;
