import { ContainerFirebase }  from "../../containers/ContainerFirebase.js";

class DAOProductosFirebase extends ContainerFirebase{
    constructor() {
        super("productos");
    }
}

export default DAOProductosFirebase