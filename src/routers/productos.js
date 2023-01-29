import express from 'express'
import * as productosController from '../controllers/productos.controller.js'

const { Router } = express;
const productosRouter = Router()

productosRouter
    .get("/", productosController.getAllProducts)
    .get("/:id", productosController.getProductById)
    .post("/", productosController.postNewProduct)
    .put("/:id", productosController.putUpdateProductById)
    .delete("/:id", productosController.deleteProductById)

export { productosRouter }