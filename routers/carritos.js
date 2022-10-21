import express from 'express';
import { Container } from '../classes/itemsContainer.js';
import { Carrito } from '../classes/carrito.js';
const { Router } = express;
const router = Router()

const carritos = new Container("./fileStorage/carritos.json"); // esta ruta toma como origen a la carpeta donde estoy parado cuando la ejecuto.

/* //Req body sugerido (json)
    {
        "prod":{
            "id":1
        },
        "prodQuantity":3
    }
*/

//funcionalidades de carritos
router.post("/",(req, res)=>{
    const carrin = new Carrito(
        "aca arriba va a ir el id",
        Date.now(),
        []
    );
    (async function(){
        await carritos.save(carrin);
    })();
    res.send(`se creo un nuevo carrito`) //deberia devolver el id del carrito (capaz ponerle un return a el metodo de itemsContainer y asignarlo a una variable que depues agregue a este string.)
})

router.delete("/:id",(req, res)=>{
    (async function(){
        await carritos.deleteById(req.params.id*1)
    })()
    res.send(`Eliminando carrito con id: ${req.params.id}`)
})

//funcionalidades de productos dentro de carrito
// lista todos los productos que hay en el carrito
router.get("/:id/productos",(req, res)=>{
    (async function(){
        const carritoRancio = await carritos.getById(req.params.id*1) // esto solamente me trae el objeto que convirtio del texto del JSON, calculo que ya no es mas una instancia de Carrito, es solo un objeto todo rancio, asi que capaz que tendria que destructurarlo 
        console.log(carritoRancio)
        res.send(carritoRancio.productos)
    })()
})
//incorporar productos al carrito por su id de producto
//sugested req body(json) = {"prod":{"id":1,...},"prodQuantity":3}
//supongo que no tengo que comprobar si el producto existe por que el body se generaria con un boton asociado al producto en cuestion... asi que si no existiese el producto nunca se podria hacer el request...
router.post("/:id/productos",(req, res)=>{
    (async function(){
        const carritoRancio = await carritos.getById(req.params.id*1) // esto solamente me trae el objeto que convirtio del texto del JSON, calculo que ya no es mas una instancia de Carrito, es solo un objeto todo rancio, asi que capaz que tendria que destructurarlo 
        if(carritoRancio !== `no se encuentra un item con el ID especificado`){
            const carrito = new Carrito(
                carritoRancio.id,
                carritoRancio.timeStamp,
                carritoRancio.productos
            )
            carrito.addToCart(req.body.prod, req.body.prodQuantity)
            console.log(carrito)
            await carritos.editById(req.params.id*1, carrito)
            res.send(`se agrego un producto al carrito ${req.params.id}`)
        } else {
            res.send(`no se encuentra el carrito especificado`)
        }
    })()
})
//Eliminar un producto(id_prod) del carrito(id)
//supongo que no tengo que comprobar si el producto existe por que el body se generaria con un boton asociado al producto en cuestion... asi que si no existiese el producto nunca se podria hacer el request...
router.delete("/:id/productos/:id_prod",(req, res)=>{
    (async function(){
        const carritoRancio = await carritos.getById(req.params.id*1) // esto solamente me trae el objeto que convirtio del texto del JSON, calculo que ya no es mas una instancia de Carrito, es solo un objeto todo rancio, asi que capaz que tendria que destructurarlo 
        if(carritoRancio !== `no se encuentra un item con el ID especificado`){
            const carrito = new Carrito(
                carritoRancio.id,
                carritoRancio.timeStamp,
                carritoRancio.productos
            )
            carrito.deleteFromCart({id: req.params.id_prod*1})
            console.log(carrito)
            await carritos.editById(req.params.id*1, carrito)
            res.send(`se borro un producto del carrito ${req.params.id}`)
        } else {
            res.send(`no se encuentra el carrito especificado`)
        }
    })()
})

export default router
