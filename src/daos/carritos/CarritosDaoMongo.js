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

    // async carritoActivoByUserId(idUser) {
    //     try {
    //         const carrito = await this.db.findOne({$and: [ {usuarioId: idUser}, {carritoActivo: true} ]})
    //         return carrito
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    // async addProductTo(idCarrito, prod) {
    //     try {
    //         const {productos} = await this.db.findOne({_id: idCarrito})
    //         productos.push(prod)
    //         await this.db.updateOne({_id: idCarrito}, { $set:{productos:productos}})
    //         console.log(`se agrego el producto ${prod} a ${idCarrito}`)
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    // async deleteProductFrom(idCarrito, prodTimestamp) {
    //     try {
    //         const {productos} = await this.db.findOne({_id: idCarrito})
    //         const newProductos = productos.filter(producto => producto.timeStamp !== Number(prodTimestamp))
    //         await this.db.updateOne({_id: idCarrito}, { $set:{ productos: newProductos }})
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    // async comprar(idCarrito, idUser, validacion) {
    //     try {
    //         if(validacion){
    //             await this.db.updateOne({_id: idCarrito}, { $set:{ carritoActivo: false }})
    //             await this.db.create({
    //                 usuarioId: idUser,
    //                 carritoActivo:  true,
    //                 productos: []
    //             })
    //         } else {
    //             console.log("cuchame una cosa.. no voy a cerrar un carrito vacio")
    //         }
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}

export default DAOCarritosMongo