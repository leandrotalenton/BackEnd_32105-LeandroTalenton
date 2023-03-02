import express from 'express'
import * as usuariosController from '../controllers/usuarios.controller.js'

const { Router } = express;
const chatRouter = Router()

export const authMw = (req, res, next) => {
    req.isAuthenticated() ? next() : res.render('./login', { error: req.query.error })
}

chatRouter
    .get("/", authMw, usuariosController.getChatGeneral)
    .get("/:destinatario", authMw, usuariosController.getChatIndividual)

export { chatRouter }