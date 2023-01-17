import express from 'express';
import { productosDAO, carritosDAO }  from '../daos/index.js'
import { enviarMensajeTxt, enviarMensajeWsp } from '../transportadores/mensajesTwilio.js';
import { sendMail } from '../transportadores/nodeMailer.js';
import { emailAdministrador } from '../utils/passport.js';
const { Router } = express;
const router = Router()

// lista productos del carrito(id)
router.get("/", async (req, res) => {
    try{
    const { productos } = await carritosDAO.carritoActivoByUserId(req.user._id)
    let prodCarrito = []
    await Promise.all(
        productos.map(async (prod) => {
            let data = await productosDAO.readById(prod.prodId);
            data = {timeStamp: prod.timeStamp, ...data._doc}
            console.log("data", data)
            prodCarrito.push(data)
        })
    );
    const total = prodCarrito.reduce(function(valorAnterior, valorActual){return Number(valorAnterior) + Number(valorActual.price);}, 0)
    res.render("./carrito", {prodCarrito, total, nombre: req.user.username, pic: req.user.pic})
    } catch (e) {
        console.log(e)
    }
})

router.get("/compra", (req, res)=>{ // <-- carrito
    let nombre = req.user.username
    res.render("./agradecimiento", { nombre })
})

//incorporar producto(id) al carrito(id)
router.post("/:id_prod/productos", async (req, res) => {
    try{
        const carrito = await carritosDAO.carritoActivoByUserId(req.user._id)
        await carritosDAO.addProductTo(carrito._id,{
            prodId:req.params.id_prod,
            timeStamp: Date.now()
        })
    } catch (e) {
        console.log(e)
    }
})

//Eliminar un producto(id_prod) del carrito(id)
router.delete("/:timeStamp/productos", async (req, res) => {
    try{
        const carrito = await carritosDAO.carritoActivoByUserId(req.user._id)
        await carritosDAO.deleteProductFrom(carrito._id, req.params.timeStamp)
        res.redirect(303, "/")
    } catch (e) {
        console.log(e)
    }
})

//Cerrar el carrito/comprar
router.put("/", async (req, res) => {
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
})

export { router }
