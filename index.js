const express = require('express');
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const admin = true

const productos = require("./routers/productos")
const carrito = require("./routers/carritos")

app.use("/productos",productos)
app.use("/carrito",carrito)

const server = app.listen(8080, ()=>{
    console.log(`Servidor express iniciado`)
})