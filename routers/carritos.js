import express from 'express';
import { MongoCarritos } from '../index.js';
const { Router } = express;
const router = Router()

// lista productos del carrito(id)
router.get("/", async (req, res) => {
    try{
    const { productos } = await MongoCarritos.carritoActivoByUserId(req.user._id)
    res.render("./carrito", {productos})
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

export { router }
