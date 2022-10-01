const express = require('express')
const { Router } = express
const router = Router()

//funcionalidades de carritos
router.post("/:id",(req, res)=>{
    console.log("id", req.params.id)
    res.send(`esto viene del router de carrito`)
})

router.delete("/:id",(req, res)=>{
    console.log("id", req.params.id)
    res.send(`esto viene del router de carrito`)
})

//funcionalidades de productos dentro de carrito
router.get("/:id/productos",(req, res)=>{
    console.log("id", req.params.id)
    res.send(`esto viene del router de carrito`)
})

router.post("/:id/productos",(req, res)=>{
    console.log("id", req.params.id)
    res.send(`esto viene del router de carrito`)
})

router.delete("/:id/productos/:id_prod",(req, res)=>{
    console.log("id", req.params.id)
    console.log("id", req.params.id_prod)
    res.send(`esto viene del router de carrito`)
})

module.exports = router
