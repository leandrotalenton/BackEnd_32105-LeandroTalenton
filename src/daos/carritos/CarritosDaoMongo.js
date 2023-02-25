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
                    cantidad: { type: Number, required: true},
                }],
                datosFinalizacionCompra: {
                    timeStamp: {type: Number}, // fecha y hora a la que se finalizo la compra
                    estado: {type: String}, // "generada" | "entregada"
                },
            }
        );
    }
}

export default DAOCarritosMongo