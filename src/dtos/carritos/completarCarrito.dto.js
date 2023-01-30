import { DaoFactory } from '../../daos/daoFactory.js';
import { carritoActivoByUserId } from '../../services/carritos.service.js';
const productosDAO = DaoFactory.getProductosDao()
const carritosDAO = DaoFactory.getCarritosDao()

export class CompletarCarritoDTO {
    constructor(userId) {
        this.userId = userId
        this.arrayProdData = []
        this.subTotal = 0
    }
    async calculateProductsDataAndSubtotal(){
        const { productos } = await carritoActivoByUserId(this.userId)
        await Promise.all(
            productos.map(async (prod) => {
                let data = await productosDAO.readById(prod.prodId);
                data = { timeStamp: prod.timeStamp, ...data._doc }
                console.log("data", data)
                this.arrayProdData.push(data)
            })
        );
        this.subTotal = this.arrayProdData.reduce((pv, cv) => pv + Number(cv.price), 0);
        return this
    }
}

