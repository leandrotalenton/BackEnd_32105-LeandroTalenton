import * as dotenv from "dotenv";
dotenv.config();

const daos = {
    fs: async () => {
        const { default: DAOCarritosFs } = await import("./carritos/CarritosDaoFs.js")
        const { default: DAOProductosFs } = await import("./productos/ProductosDaoFs.js")
        return {
            carritosDAO: new DAOCarritosFs(),
            productosDAO: new DAOProductosFs()
        }
    },
    firebase: async () => {
        const { default: DAOCarritosFirebase } = await import("./carritos/CarritosDaoFirebase.js")
        const { default: DAOProductosFirebase } = await import("./productos/ProductosDaoFirebase.js")
        return {
            carritosDAO: new DAOCarritosFirebase(),
            productosDAO: new DAOProductosFirebase()
        }
    },
    mongo: async () => {
        const { default: DAOCarritosMongoDb } = await import("./carritos/CarritosDaoMongoDb.js")
        const { default: DAOProductosMongoDb } = await import("./productos/ProductosDaoMongoDb.js")
        return {
            carritosDAO: new DAOCarritosMongoDb(),
            productosDAO: new DAOProductosMongoDb()
        }
    }
}

export default daos[process.env.TIPO]