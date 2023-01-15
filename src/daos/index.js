import * as dotenv from "dotenv";
dotenv.config();

const daos = {
    // memory: async () => {
    //     const { default: DAOChatsMemory } = await import("./chats/ChatsDaoMemory.js")
    //     return {
    //         chatsDAO: new DAOChatsMemory(),
    //     }
    // },
    // fs: async () => {
    //     const { default: DAOChatsFs } = await import("./chats/ChatsDaoFs.js")
    //     return {
    //         chatsDAO: new DAOChatsFs(),
    //     }
    // },
    mongo: async () =>  {
        const { default: DAOCarritosMongo } = await import("./carritos/CarritosDaoMongo.js")
        const { default: DAOChatsMongo } = await import("./chats/ChatsDaoMongo.js")
        const { default: DAOProductosMongo } = await import("./productos/ProductosDaoMongo.js")
        const { default: DAOUsuariosMongo } = await import("./usuarios/UsuariosDAOMongo.js")
        return {
            // carritosDAO: new DAOCarritosMongo(),
            chatsDAO: new DAOChatsMongo(),
            // productosDAO: new DAOProductosMongo(),
            // usuariosDAO: new DAOUsuariosMongo(),
        }
    }
}

export default daos[process.env.TIPO]