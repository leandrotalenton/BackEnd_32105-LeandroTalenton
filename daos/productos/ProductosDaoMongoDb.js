import { ContainerMongoDb }  from "../../containers/ContainerMongoDb.js";

class DAOProductosMongoDb extends ContainerMongoDb{
    constructor() {
        super("productos", {
            timeStamp: Number,
            name: String,
            description: String,
            code: String,
            picture: String,
            price: Number,
            stock: Number
        })
    }
}

export default DAOProductosMongoDb