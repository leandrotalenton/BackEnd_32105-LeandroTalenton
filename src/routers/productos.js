import express from 'express'
import * as productosController from '../controllers/productos.controller.js'
import { uploadProductPic } from '../utils/multer.js';

const { Router } = express;
const productosRouter = Router()

productosRouter
    .get("/", productosController.getAllProducts)
    .get("/:id", productosController.getProductById)
    .post("/", uploadProductPic.single('uploaded_file') ,productosController.postNewProduct)
    .put("/:id", productosController.putUpdateProductById)
    .delete("/:id", productosController.deleteProductById)

export { productosRouter }