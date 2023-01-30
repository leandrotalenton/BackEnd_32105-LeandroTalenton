import { DaoFactory } from "../daos/daoFactory.js"
const carritosDAO = DaoFactory.getCarritosDao()

export async function carritoActivoByUserId(idUser) {
    try {
        const carritos = await carritosDAO.read()
        const carrito = await carritos.find(carrito => {
            return (carrito.usuarioId == idUser && carrito.carritoActivo)
        })
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
        const carrito = await carritosDAO.readById(idCarrito)
        carrito.productos.push(prod)
        await carritosDAO.updateById(idCarrito, carrito)
        console.log(`se agrego el producto ${prod} a ${idCarrito}`)
    } catch (e) {
        console.log(e)
    }
}


// addProductTo('63d700eb1a200266f9425121', {test: 'test'})


export async function deleteProductFrom(idCarrito, prodTimestamp) {
    try {
        const carrito = await carritosDAO.readById(idCarrito)
        carrito.productos = carrito.productos.filter( prod => prod.timeStamp != prodTimestamp )
        await carritosDAO.updateById(idCarrito, carrito)
        console.log(`se saca el prodcuto con timestamp ${prodTimestamp} de ${idCarrito}`)
    } catch (e) {
        console.log(e)
    }
}

// deleteProductFrom('63d70557322f28f3e6d0a95c', '1675036001428')


export async function comprar(idCarrito, idUser, validacion) {
    try {
        if (validacion) {
            const carrito = await carritosDAO.readById(idCarrito)
            carrito.carritoActivo = false
            await carritosDAO.updateById(idCarrito, carrito)
            await carritosDAO.create({
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

// comprar('63d70557322f28f3e6d0a95c', '63bb49bf05ec7faac6e479b1', true)
