import express from 'express';
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const admin = true

/* //Req body sugerido (json)
    {
        "id": "1",
        "name": "El loco del 60",
        "description": "Sabe muchas cosas que nadie sabe en el mundo",
        "code": "El codigo del FBI es... JJX",
        "picture": "https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png",
        "price": 777,
        "stock": 111
    }
*/

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