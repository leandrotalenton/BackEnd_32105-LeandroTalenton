import express from 'express';
import { Container } from '../containers/containerFs.js';
const { Router } = express;
const router = Router()

const carritos = new Container("./fileStorage/carritos.json");

//funcionalidades de carritos ////////////////////////////////////////////////////////////////////////////////////////////
router.post("/", (req, res) => {
    (async function () {
        try {
            const newCarrito = {
                id: null,
                timeStamp: Date.now(),
                productos: []
            }
            await carritos.create(newCarrito);
            res.send(`se creo un nuevo carrito`)
        } catch (e) {
            console.log(e)
        }
    })();
})

router.delete("/:id", (req, res) => {
    (async function () {
        try {
            const response = await carritos.deleteById(req.params.id * 1)
            res.send(response)
        } catch (e) {
            console.log(e)
        }
    })()
})

//funcionalidades de productos dentro de carrito /////////////////////////////////////////////////////////////////////////
// lista productos del carrito(id)
router.get("/:id/productos", (req, res) => {
    (async function () {
        try {
            const response = await carritos.readById(req.params.id * 1)
            res.send(response?.productos || `no se encuentra un item con el ID especificado`)
        } catch (e) {
            console.log(e)
        }
    })()
})

//incorporar productos al carrito(id)
router.post("/:id/productos", (req, res) => {
    (async function () {
        try {
            const carrito = await carritos.readById(req.params.id * 1)
            if (carrito) {
                carrito.productos.push(req.body)
                const result = await carritos.updateById(req.params.id * 1, carrito)
                res.send(result)
            } else {
                res.send(`no se encuentra el carrito especificado`)
            }
        } catch (e) {
            console.log(e)
        }
    })()
})

//Eliminar un producto(id_prod) del carrito(id)
router.delete("/:id/productos/:id_prod", (req, res) => {
    (async function () {
        try {
            const carritoRancio = await carritos.readById(req.params.id * 1)
            if (carritoRancio) {
                const contained = carritoRancio.productos.find(producto => producto.id * 1 === req.params.id_prod * 1)
                if (contained) {
                    carritoRancio.productos = carritoRancio.productos.filter(producto => producto.id * 1 !== req.params.id_prod * 1)
                    await carritos.updateById(req.params.id * 1, carritoRancio)
                    res.send(`se borra producto ${req.params.id_prod} del carrito ${req.params.id}`)
                } else {
                    res.send(`no se encuentra el producto especificado`)
                }
            } else {
                res.send(`no se encuentra el carrito especificado`)
            }
        } catch (e) {
            console.log(e)
        }
    })()
})

export default router
