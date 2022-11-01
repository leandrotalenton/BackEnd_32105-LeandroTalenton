import { ContainerFs } from "../../containers/ContainerFs.js";

class DAOCarritosFs extends ContainerFs{
    constructor(){
        super("./fileStorage/carritos.json")
    }
}

export default DAOCarritosFs