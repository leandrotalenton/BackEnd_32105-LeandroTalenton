import { DaoFactory } from '../daos/daoFactory.js';

const productosDAO = DaoFactory.getProductosDao()

// devuelve todos los productos
export const getAllProducts = async (req, res) => {
    try {
        const arrProductos = await productosDAO.read()
        res.render(`./partials/productos`, { arrProductos })
    } catch (err) {
        res.status(404).send(err)
    }
}

//devuelve un producto segun su id
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const producto = await productosDAO.readById(id)
        res.send(producto)
    } catch (err) {
        res.status(404).send(err)
    }
}

//recibe y agrega un producto, y lo devuelve con su id asignado
export const postNewProduct = async (req, res) => {
    try {
        const producto = await productosDAO.create(req.body)
        res.send(producto)
    } catch (e) {
        console.log(e)
    }
}

//recibe y actualiza un producto segun su id
export const putUpdateProductById = async (req, res) => {
    try {
        const { id } = req.params
        const prodcutToReplace = await productosDAO.readById(id)
        if (prodcutToReplace) {
            const producto = await productosDAO.updateById(id, req.body)
            res.send(producto)
        } else {
            res.status(404).send({ error: `producto no encontrado` })
        }
    } catch (e) {
        console.log(e)
    }
}

//elimina un producto segun su id
export const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params
        const prodcutToDelete = await productosDAO.readById(id)
        if (prodcutToDelete) {
            const mensajeProductoBorrado = await productosDAO.deleteById(id)
            res.send(mensajeProductoBorrado)
        } else {
            res.status(404).send({ error: `producto no encontrado` })
        }
    } catch (e) { 
        console.log(e) 
    }
}