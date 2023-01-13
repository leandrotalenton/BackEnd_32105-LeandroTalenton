import express from 'express';
import { DbProductos, emailAdministrador, MongoCarritos } from '../index.js';
import { sendMail } from '../transportadores/nodeMailer.js';
const { Router } = express;
const router = Router()

// lista productos del carrito(id)
router.get("/", async (req, res) => {
    try{
    const { productos } = await MongoCarritos.carritoActivoByUserId(req.user._id)
    let prodCarrito = []
    await Promise.all(
        productos.map(async (prod) => {
            let data = await DbProductos.readById(prod.prodId);
            data = {timeStamp: prod.timeStamp, ...data._doc}
            console.log("data", data)
            prodCarrito.push(data)
        })
    );
    // console.log("arrarrarrarrarrarrarr",prodCarrito)
    const total = prodCarrito.reduce(function(valorAnterior, valorActual){return Number(valorAnterior) + Number(valorActual.price);}, 0)
    res.render("./carrito", {prodCarrito, total, nombre: req.user.username, pic: req.user.pic})
    } catch (e) {
        console.log(e)
    }
})

//incorporar producto(id) al carrito(id)
router.post("/:id_prod/productos", async (req, res) => {
    try{
        const carrito = await MongoCarritos.carritoActivoByUserId(req.user._id)
        await MongoCarritos.addProductTo(carrito._id,{
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
        const carrito = await MongoCarritos.carritoActivoByUserId(req.user._id)
        await MongoCarritos.deleteProductFrom(carrito._id, req.params.timeStamp)
        res.redirect(303, "/")
    } catch (e) {
        console.log(e)
    }
})

//Cerrar el carrito/comprar
router.put("/", async (req, res) => {
    try{
        const carrito = await MongoCarritos.carritoActivoByUserId(req.user._id)
        await MongoCarritos.comprar(carrito._id, req.user._id, carrito.productos.length)
        await sendMail(
            emailAdministrador,
            `nuevo pedido de ${req.user.username}, email ${req.user.email}`,
            `<div>${JSON.stringify(carrito)}</div>`
        )
        res.redirect(303, "/")
    } catch (e) {
        console.log(e)
    }
})

export { router }
