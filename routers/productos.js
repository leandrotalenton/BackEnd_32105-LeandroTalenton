const express = require('express')
const { Router } = express
const router = Router()

router.get("/",(req, res)=>{
    res.send(`esto viene del router de productos`)
})

router.get("/:id",(req, res)=>{
    console.log("id", req.params.id)
    res.send(`esto viene del router de productos`)
})

router.post("/",(req, res)=>{
    res.send(`esto viene del router de productos`)
})

router.put("/:id",(req, res)=>{
    console.log("id", req.params.id)
    res.send(`esto viene del router de productos`)
})

router.delete("/:id",(req, res)=>{
    console.log("id", req.params.id)
    res.send(`esto viene del router de productos`)
})

module.exports = router
