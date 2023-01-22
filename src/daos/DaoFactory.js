import DAOCarritosMongo from "./carritos/CarritosDaoMongo.js";
import DAOChatsMongo from "./chats/ChatsDaoMongo.js";
import DAOProductosMongo from "./productos/ProductosDaoMongo.js";
import DAOUsuariosMongo from "./usuarios/UsuariosDAOMongo.js";

const opcion = process.argv[2] || "MongoAtlas";

let daoUsuarios;
let daoCarritos;
let daoProductos;
let daoChats;

switch (opcion) {
    // case "File":
    //     daoUsuarios = new PersonasDaoFile(rutaArchivoPersonas);
    //     daoCarritos = new CarritosDaoFile(rutaArchivoPersonas);
    //     daoProductos = new MensajesDaoFile(rutaArchivoPersonas);
    //     daoChats = new MensajesDaoFile(rutaArchivoPersonas);
    //     break;
    default:
        daoUsuarios = new DAOUsuariosMongo();
        daoCarritos = new DAOCarritosMongo();
        daoProductos = new DAOProductosMongo();
        daoChats = new DAOChatsMongo();
}

export class DaoFactory {
    static getUsuariosDao() {
        return daoUsuarios;
    }
    static getCarritosDao() {
        return daoCarritos;
    }
    static getProductosDao() {
        return daoProductos;
    }
    static getChatsDao() {
        return daoChats;
    }
}
