// import express from 'express'
import Router from 'koa-router';
import * as productosController from '../controllers/productos.controllerKoa.js'

const productosRouterKoa = new Router()



productosRouterKoa
    .get('/', (ctx, next) => {
        ctx.body = 'Hello World!';
    })
    .get("/", productosController.getAllProducts)
    .get("/:id", productosController.getProductById)
    .post("/", productosController.postNewProduct)
    .put("/:id", productosController.putUpdateProductById)
    .delete("/:id", productosController.deleteProductById)

export { productosRouterKoa }