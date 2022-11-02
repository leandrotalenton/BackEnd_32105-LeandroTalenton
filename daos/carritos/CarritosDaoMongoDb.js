import { ContainerMongoDb }  from "../../containers/ContainerMongoDb.js";

class DAOCarritosMongoDb extends ContainerMongoDb{
    constructor() {
        super("carritos", {
            timeStamp: Number,
            productos: Array
        })
    }
}

export default DAOCarritosMongoDb