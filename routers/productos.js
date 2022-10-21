import express from 'express';
// const { Container } = require('../classes/itemsContainer')
import { Container } from '../classes/itemsContainer.js';
// const { Producto } = require('../classes/producto')
import { Producto } from '../classes/producto.js';
const { Router } = express
const router = Router()

const admin = true
const productos = new Container("./fileStorage/productos.json"); // esta ruta toma como origen a la carpeta donde estoy parado cuando la ejecuto.

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

const adminOnly = (req, res, next)=>{
    if(admin){
        next()
    } else {
        res.send({
            error: -1,
            descripcion: `ruta ${req.path} metodo ${req.method} no autorizada`
        })
    }
}

router.get("/",(req, res)=>{
    (async function(){
        res.send(await productos.getAll())
    })()
})

router.get("/:id",(req, res)=>{
    (async function(){
        res.send(await productos.getById(req.params.id*1))
    })()
})

router.post("/",adminOnly,(req, res)=>{
    const productin = new Producto(
        "aca arriba va a ir el id",
        Date.now(),
        req.body.name,
        req.body.description,
        req.body.code,
        req.body.picture,
        req.body.price,
        req.body.stock
    );
    (async function(){
        await productos.save(productin);
    })();
    res.send(`se agrego: ${productin.name}`)
})

router.put("/:id",adminOnly,(req, res)=>{
    const productin = new Producto(
        "aca arriba va a ir el id",
        Date.now(),
        req.body.name,
        req.body.description,
        req.body.code,
        req.body.picture,
        req.body.price,
        req.body.stock
    );
    (async function(){
        await productos.editById(req.params.id*1, productin)
    })();
    res.send(`se actualizo el producto con id ${req.params.id}: con los datos de ${productin.name}`)
})

router.delete("/:id",adminOnly,(req, res)=>{
    (async function(){
        await productos.deleteById(req.params.id*1)
    })()
    res.send(`Eliminando producto con id: ${req.params.id}`)
})

export default router
