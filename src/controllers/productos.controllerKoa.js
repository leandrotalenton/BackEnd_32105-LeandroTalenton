import { DaoFactory } from '../daos/daoFactory.js';

const productosDAO = DaoFactory.getProductosDao()

// devuelve todos los productos
export const getAllProducts = async (ctx) => {
    try {
        const arrProductos = await productosDAO.read()
        ctx.body = arrProductos
    } catch (err) {
        ctx.status = 400
        ctx.body = err
    }
}

//devuelve un producto segun su id
export const getProductById = async (ctx) => {
    try {
        const { id } = ctx.params
        const producto = await productosDAO.readById(id)
        console.log(producto)
        if (producto) {
            ctx.status = 200
            ctx.body = producto
        }
        ctx.status = 404
        ctx.body = { error: `producto no encontrado` }
    } catch (err) {
        ctx.status = 404
        ctx.body = err
    }
}

//recibe y agrega un producto, y lo devuelve con su id asignado
export const postNewProduct = async (ctx) => {
    try {
        const producto = await productosDAO.create(ctx.body)
        ctx.status = 201
        ctx.body = producto
    } catch (err) {
        ctx.status = 404
        ctx.body = err
    }
}

//recibe y actualiza un producto segun su id
export const putUpdateProductById = async (ctx) => {
    try {
        const { id } = ctx.params
        const prodcutToReplace = await productosDAO.readById(id)
        if (prodcutToReplace) {
            const producto = await productosDAO.updateById(id, ctx.body)
            ctx.body = producto
        } else {
            ctx.status = 404
            ctx.body = { error: `producto no encontrado` }
        }
    } catch (err) {
        ctx.status = 404
        ctx.body = err
    }
}

//elimina un producto segun su id
export const deleteProductById = async (ctx) => {
    try {
        const { id } = ctx.params
        const prodcutToDelete = await productosDAO.readById(id)
        if (prodcutToDelete) {
            const mensajeProductoBorrado = await productosDAO.deleteById(id)
            ctx.status = 204
            ctx.body = mensajeProductoBorrado
        } else {
            ctx.status = 404
            ctx.body = { error: `producto no encontrado` }
        }
    } catch (err) {
        ctx.status = 404
        ctx.body = err
    }
}