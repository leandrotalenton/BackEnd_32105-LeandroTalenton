import { CompletarCarritoDTO } from '../dtos/carritos/completarCarrito.dto.js';
import { DaoFactory } from '../daos/daoFactory.js';
import { enviarMensajeTxt, enviarMensajeWsp } from '../transporters/mensajesTwilio.js';
import { sendMail } from '../transporters/nodeMailer.js';
import { emailAdministrador } from '../utils/passport.js';

const carritosDAO = DaoFactory.getCarritosDao()

// lista productos del carrito(id)
export const getAllActiveCartProducts = async (req, res) => {
    try{
    const carritoCompleto = new CompletarCarritoDTO(req.user._id)
    const {arrayProdData, subTotal} = await carritoCompleto.calculateProductsDataAndSubtotal()
    res.render("./carrito", {arrayProdData, subTotal, nombre: req.user.username, pic: req.user.pic})
    } catch (e) {
        console.log(e)
    }
}

// agradecimiento personalizado
export const getThankYouScreen = (req, res)=>{
    let nombre = req.user.username
    res.render("./agradecimiento", { nombre })
}

//incorporar producto(id) al carrito(id)
export const postProductToActiveCart = async (req, res) => {
    try{
        const carrito = await carritosDAO.carritoActivoByUserId(req.user._id)
        await carritosDAO.addProductTo(carrito._id,{
            prodId:req.params.id_prod,
            timeStamp: Date.now()
        })
    } catch (e) {
        console.log(e)
    }
}

//Eliminar un producto(id_prod) del carrito(id)
export const deleteProductFromActiveCart = async (req, res) => {
    try{
        const carrito = await carritosDAO.carritoActivoByUserId(req.user._id)
        await carritosDAO.deleteProductFrom(carrito._id, req.params.timeStamp)
        res.redirect(303, "/")
    } catch (e) {
        console.log(e)
    }
}

//Cerrar el carrito/comprar
export const putCartAsClosed = async (req, res) => {
    try{
        const carrito = await carritosDAO.carritoActivoByUserId(req.user._id)
        await carritosDAO.comprar(carrito._id, req.user._id, carrito.productos.length)
        await sendMail(
            emailAdministrador,
            `nuevo pedido de ${req.user.username}, email ${req.user.email}`,
            `<div>${JSON.stringify(carrito)}</div>`
        ) // email con datos de la compra al administrador
        await enviarMensajeWsp(`nuevo pedido de ${req.user.username}, email ${req.user.email}`) // mensaje de whatsapp al administrador
        await enviarMensajeTxt("Tu pedid se ha recibido y se encuentra en proceso", req.user.phone) // mensaje de texto al cliente
        res.redirect("/")
    } catch (e) {
        console.log(e)
    }
}
