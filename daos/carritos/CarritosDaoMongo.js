import { ContainerMongoDb } from "../../containers/ContainerMongoDb.js";

class DAOCarritosMongo extends ContainerMongoDb {
    constructor() {
        super(
            "carritos",
            {
                usuarioId: { type: String, required: true},
                carritoActivo: { type: Boolean, required: true},
                productos: [{
                    prodId: { type: String, required: true},
                    timeStamp: { type: Number, required: true},
                }]
            }
        );
    }

    async carritoActivoByUserId(idUser) {
        try {
            const carrito = await this.db.findOne({$and: [ {usuarioId: idUser}, {carritoActivo: true} ]})
            return carrito
        } catch (e) {
            console.log(e)
        }
    }

    async addProductTo(idCarrito, prod) {
        try {
            const {productos} = await this.db.findOne({_id: idCarrito})
            productos.push(prod)
            await this.db.updateOne({_id: idCarrito}, { $set:{productos:productos}})
            console.log(`se agrego el producto ${prod} a ${idCarrito}`)
        } catch (e) {
            console.log(e)
        }
    }

    async deleteProductFrom(idCarrito, prodTimestamp) {
        try {
            const {productos} = await this.db.findOne({_id: idCarrito})
            console.log("productos antes",productos)
            const newProductos = productos.filter(producto => {
                console.log(typeof(producto.timeStamp),producto.timeStamp)
                console.log(typeof(Number(prodTimestamp)),Number(prodTimestamp))
                console.log(producto.timeStamp !== Number(prodTimestamp))
                return producto.timeStamp !== Number(prodTimestamp)
            })
            console.log("productos despues",productos)
            await this.db.updateOne({_id: idCarrito}, { $set:{ productos: newProductos }})
        } catch (e) {
            console.log(e)
        }
    }
}

export default DAOCarritosMongo