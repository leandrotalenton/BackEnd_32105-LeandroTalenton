import { DaoFactory } from '../daos/DaoFactory.js';
const carritosDAO = DaoFactory.getCarritosDao()

export async function carritoActivoByUserId(idUser) {
    try {
        const carritos = await carritosDAO.read()
        const carrito = carritos.filter(carrito => carrito.usuarioId == idUser && carrito.carritoActivo === true)
        return carrito
    } catch (e) {
        console.log(e)
    }
}

// console.log(
//     await carritoActivoByUserId('63bb49bf05ec7faac6e479b1')
// )

export async function addProductTo(idCarrito, prod) {
    try {
        const { productos } = await this.db.findOne({ _id: idCarrito })
        productos.push(prod)
        await this.db.updateOne({ _id: idCarrito }, { $set: { productos: productos } })
        console.log(`se agrego el producto ${prod} a ${idCarrito}`)
    } catch (e) {
        console.log(e)
    }
}

export async function deleteProductFrom(idCarrito, prodTimestamp) {
    try {
        const { productos } = await this.db.findOne({ _id: idCarrito })
        const newProductos = productos.filter(producto => producto.timeStamp !== Number(prodTimestamp))
        await this.db.updateOne({ _id: idCarrito }, { $set: { productos: newProductos } })
    } catch (e) {
        console.log(e)
    }
}

export async function comprar(idCarrito, idUser, validacion) {
    try {
        if (validacion) {
            await this.db.updateOne({ _id: idCarrito }, { $set: { carritoActivo: false } })
            await this.db.create({
                usuarioId: idUser,
                carritoActivo: true,
                productos: []
            })
        } else {
            console.log("cuchame una cosa.. no voy a cerrar un carrito vacio")
        }
    } catch (e) {
        console.log(e)
    }
}