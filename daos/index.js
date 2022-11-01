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
    // fs: async () => {
    //     const { default: DAOCarritosFs } = await import("./carritos/CarritosDaoFs.js")
    //     const { default: DAOProductosFs } = await import("./productos/ProductosDaoFs.js")
    //     return {
    //         carritosDAO: new DAOCarritosFs(),
    //         productosDAO: new DAOProductosFs()
    //     }
    // },
}

export default daos[process.env.TIPO]