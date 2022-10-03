const express = require('express');
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const admin = true

const productos = require("./routers/productos")
const carrito = require("./routers/carritos")

app.use("/productos",productos)
app.use("/carrito",carrito)

app.get("*", (req, res)=>{
    res.send({
        error: -2,
        descripccion: `ruta ${req.path} metodo ${req.method} no implementada`
    })
})

const server = app.listen(8080, ()=>{
    console.log(`Servidor express iniciado`)
})