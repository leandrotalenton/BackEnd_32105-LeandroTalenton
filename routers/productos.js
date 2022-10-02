const express = require('express')
const { Container } = require('../classes/fs')
const { Producto } = require('../classes/producto')
const { Router } = express
const router = Router()

const admin = true
const productos = new Container("./fileStorage/productos.json"); // esta ruta toma como origen a la carpeta donde estoy parado cuando la ejecuto.

const adminOnly = (req, res, next)=>{
    if(admin){
        next()
    } else {
        res.send(`You do not have the required access`)
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
        await productos.putById(req.params.id*1, productin)
    })();
    res.send(`se actualizo el producto con id ${req.params.id}: con los datos de ${productin.name}`)
})

router.delete("/:id",adminOnly,(req, res)=>{
    (async function(){
        await productos.deleteById(req.params.id*1)
    })()
    res.send(`Eliminando producto con id: ${req.params.id}`)
})

module.exports = router
