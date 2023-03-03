import DAOCarritosMongo from "./carritos/CarritosDaoMongo.js";
import DAOChatsMongo from "./chats/ChatsDaoMongo.js";
import DAOOrdenesMongo from "./ordenes/OrdenesDAOMongo.js";
import DAOProductosMongo from "./productos/ProductosDaoMongo.js";
import DAOUsuariosMongo from "./usuarios/UsuariosDAOMongo.js";

const opcion = process.env.TIPO || "MONGO"; //<-- esto nos lo habian mostrado como que se pasaba como process.argv[2], pero por ahora prefiero seguir trabajando como node.env

let daoUsuarios;
let daoCarritos;
let daoProductos;
let daoChats;
let daoOrdenes;

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
        daoOrdenes = new DAOOrdenesMongo();
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
    static getOrdenesDao() {
        return daoOrdenes;
    }
}
