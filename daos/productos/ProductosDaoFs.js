import { ContainerFs } from "../../containers/ContainerFs.js";

class DAOProductosFs extends ContainerFs{
    constructor(){
        super("./fileStorage/productos.json")
    }
}

export default DAOProductosFs