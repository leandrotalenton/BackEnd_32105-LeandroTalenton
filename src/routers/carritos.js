import express from 'express';
import * as carritosController from '../controllers/carritos.controller.js'

const { Router } = express;
const carritosRouter = Router()

carritosRouter
    .get("/", carritosController.getAllActiveCartProducts)
    .get("/compra", carritosController.getThankYouScreen)
    .post("/:id_prod/productos", carritosController.postProductToActiveCart)
    .put("/", carritosController.putCartAsClosed)
    .delete("/:timeStamp/productos", carritosController.deleteProductFromActiveCart)

export { carritosRouter }