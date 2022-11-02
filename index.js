import express from 'express';
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const admin = true

import daos from "./daos/index.js"
const { productosDAO, carritosDAO } = await daos()
export {productosDAO, carritosDAO}


import productos from "./routers/productos.js";
import carrito from "./routers/carritos.js";

app.use("/productos",productos)
app.use("/carrito",carrito)

app.all("*", (req, res)=>{
    res.send({
        error: -2,
        descripccion: `ruta ${req.path} metodo ${req.method} no implementada`
    })
})

const server = app.listen(8080, ()=>{
    console.log(`Servidor express iniciado`)
})