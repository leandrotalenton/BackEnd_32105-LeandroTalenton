import express from 'express';
// import { ContainerFs } from '../containers/ContainerFs.js';
// import daos from "../daos/index.js"
import { productosDAO } from '../index.js'
const { Router } = express
const router = Router()

// const { productosDAO } = await daos()
const admin = true
// const productos = new ContainerFs("./fileStorage/productos.json"); // esta ruta toma como origen a la carpeta donde estoy parado cuando la ejecuto.

/* //Req body sugerido (json)
    {
        "name": "El loco del 60",
        "description": "Sabe muchas cosas que nadie sabe en el mundo",
        "code": "El codigo del FBI es... JJX",
        "picture": "https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png",
        "price": 15,
        "stock": 6
    }
*/

const adminOnly = (req, res, next) => {
    if (admin) {
        next()
    } else {
        res.send({
            error: -1,
            descripcion: `ruta ${req.path} metodo ${req.method} no autorizada`
        })
    }
}

router.get("/", (req, res) => {
    (async function () {
        try {
            res.send(await productosDAO.read())
        } catch (e) {
            console.log(e)
        }
    })()
})

router.get("/:id", (req, res) => {
    (async function () {
        try {
            res.send(await productosDAO.readById(req.params.id) || `no se encuentra un item con el ID especificado`)
        } catch (e) {
            console.log(e)
        }
    })()
})

router.post("/", adminOnly, (req, res) => {
    (async function () {
        try {
            const productin = {
                id: null,
                timeStamp: Date.now(),
                name: req.body.name,
                description: req.body.description,
                code: req.body.code,
                picture: req.body.picture,
                price: req.body.price,
                stock: req.body.stock
            }
            await productosDAO.create(productin);
            res.send(`se agrego: ${productin.name}`)
        } catch (e) {
            console.log(e)
        }
    })();
})

router.put("/:id", adminOnly, (req, res) => {
    (async function () {
        try {
            const productin = {
                id: null,
                timeStamp: Date.now(),
                name: req.body.name,
                description: req.body.description,
                code: req.body.code,
                picture: req.body.picture,
                price: req.body.price,
                stock: req.body.stock
            }
            const result = await productosDAO.updateById(req.params.id, productin)
            res.send(result)
        } catch (e) {
            console.log(e)
        }
    })();
})

router.delete("/:id", adminOnly, (req, res) => {
    (async function () {
        try {
            const result = await productosDAO.deleteById(req.params.id);
            res.send(result)
        } catch (e) {
            console.log(e)
        };
    })()
})

export default router
