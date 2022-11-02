import express from 'express';
import { carritosDAO } from '../index.js'
const { Router } = express;
const router = Router()


//funcionalidades de carritos ////////////////////////////////////////////////////////////////////////////////////////////
router.get("/", (req, res) => {
    (async function () {
        try {
            res.send(await carritosDAO.read())
        } catch (e) {
            console.log(e)
        }
    })()
})

router.post("/", (req, res) => {
    (async function () {
        try {
            const newCarrito = {
                id: null,
                timeStamp: Date.now(),
                productos: []
            }
            await carritosDAO.create(newCarrito);
            res.send(`se creo un nuevo carrito`)
        } catch (e) {
            console.log(e)
        }
    })();
})

router.delete("/:id", (req, res) => {
    (async function () {
        try {
            const response = await carritosDAO.deleteById(req.params.id)
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
            const response = await carritosDAO.readById(req.params.id)
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
            const carrito = await carritosDAO.readById(req.params.id)
            if (carrito) {
                carrito.productos.push(req.body)
                const result = await carritosDAO.updateById(req.params.id, carrito)
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
            const carritoRancio = await carritosDAO.readById(req.params.id)
            if (carritoRancio) {
                const contained = carritoRancio.productos.find(producto => producto.id === req.params.id_prod)
                if (contained) {
                    carritoRancio.productos = carritoRancio.productos.filter(producto => producto.id !== req.params.id_prod)
                    await carritosDAO.updateById(req.params.id, carritoRancio)
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
