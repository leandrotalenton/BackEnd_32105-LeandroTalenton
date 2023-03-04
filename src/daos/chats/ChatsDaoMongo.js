import { ContainerMongoDb } from "../../containers/ContainerMongoDb.js";

class DAOChatsMongo extends ContainerMongoDb {
  constructor() {
    super("chats", {
      autor: {
        username: { type: String, required: true },
        pic: { type: String, required: true },
      },
      destinatario: { type: String, required: true, default: "All" },
      msj: { type: String, required: true },
      date: { type: String, required: true },
    });
  }
}

export default DAOChatsMongo;
