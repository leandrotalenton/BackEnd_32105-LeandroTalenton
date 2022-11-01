import express from 'express';
import { Container } from '../containers/containerFs.js';
const { Router } = express;
const router = Router()

const carritos = new Container("./fileStorage/carritos.json");

//funcionalidades de carritos ////////////////////////////////////////////////////////////////////////////////////////////
router.post("/",(req, res)=>{
    (async function(){
        const newCarrito = {
            id: null,
            timeStamp: Date.now(),
            productos: []
        }
        await carritos.save(newCarrito);
        res.send(`se creo un nuevo carrito`)
    })();
})

router.delete("/:id",(req, res)=>{
    (async function(){
        await carritos.deleteById(req.params.id*1)
        res.send(`Eliminando carrito con id: ${req.params.id}`)
    })()
})

//funcionalidades de productos dentro de carrito /////////////////////////////////////////////////////////////////////////
// lista productos del carrito
router.get("/:id/productos",(req, res)=>{
    (async function(){
        const carrito = await carritos.getById(req.params.id*1)
        res.send(carrito.productos)
    })()
})

//incorporar productos al carrito
router.post("/:id/productos",(req, res)=>{
    (async function(){
        const carrito = await carritos.getById(req.params.id*1)
        if(carrito !== `no se encuentra un item con el ID especificado`){
            carrito.productos.push(req.body)
            await carritos.editById(req.params.id*1, carrito)
            res.send(`se agrego un producto al carrito ${req.params.id}`)
        } else {
            res.send(`no se encuentra el carrito especificado`)
        }
    })()
})

//Eliminar un producto(id_prod) del carrito(id)
router.delete("/:id/productos/:id_prod",(req, res)=>{
    (async function(){
        const carritoRancio = await carritos.getById(req.params.id*1)
        if(carritoRancio !== `no se encuentra un item con el ID especificado`){
            carritoRancio.productos = carritoRancio.productos.filter(producto => producto.id*1 !== req.params.id_prod*1)
            await carritos.editById(req.params.id*1, carritoRancio)
            res.send(`se borro un producto del carrito ${req.params.id}`)
        } else {
            res.send(`no se encuentra el carrito especificado`)
        }
    })()
})

export default router
