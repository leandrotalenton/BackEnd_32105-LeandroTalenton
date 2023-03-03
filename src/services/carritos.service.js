import { DaoFactory } from "../daos/daoFactory.js";
import logger from "../loggers/configLog4JS.js";
const carritosDAO = DaoFactory.getCarritosDao();
const ordenesDAO = DaoFactory.getOrdenesDao();

export async function carritoActivoByUserId(idUser) {
  try {
    const carritos = await carritosDAO.read();
    const carrito = await carritos.find((carrito) => {
      return carrito.usuarioId == idUser && carrito.carritoActivo;
    });
    return carrito;
  } catch (e) {
    logger.error(e);
  }
}

export async function addProductTo(idCarrito, prodToAdd) {
  try {
    const carrito = await carritosDAO.readById(idCarrito);
    const prodExistente = carrito.productos.find(
      (producto) => producto.prodId === prodToAdd.prodId
    );
    prodExistente
      ? (prodExistente.cantidad += Number(prodToAdd.cantidad))
      : carrito.productos.push(prodToAdd);
    await carritosDAO.updateById(idCarrito, carrito);
  } catch (e) {
    logger.error(e);
  }
}

export async function deleteProductFrom(idCarrito, idProd, cantidadABorrar) {
  try {
    const carrito = await carritosDAO.readById(idCarrito);
    const producto = carrito.productos.find(
      (prod) => prod.prodId === idProd
    );
    if(Number(cantidadABorrar) >= Number(producto.cantidad)){
      carrito.productos = carrito.productos.filter(
        (prod) => prod.prodId !== idProd
      )
    } else {
      producto.cantidad -= Number(cantidadABorrar)
    }
    await carritosDAO.updateById(idCarrito, carrito);
  } catch (e) {
    logger.error(e);
  }
}

export async function comprar(idCarrito, idUser, validacion) {
  try {
    if (validacion) {
      const carrito = await carritosDAO.readById(idCarrito);
      carrito.carritoActivo = false;
      await carritosDAO.updateById(idCarrito, carrito);
      await ordenesDAO.create({
        usuarioId: idUser,
        carritoId: idCarrito,
        timeStamp: new Date().toLocaleString(),
        estado: "generada"
      })
      await carritosDAO.create({
        usuarioId: idUser,
        carritoActivo: true,
        productos: [],
      });
    } else {
      logger.warn("cuchame una cosa.. no voy a cerrar un carrito vacio");
    }
  } catch (e) {
    logger.error(e);
  }
}
