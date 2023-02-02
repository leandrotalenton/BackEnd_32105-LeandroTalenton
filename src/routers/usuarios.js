import express from 'express'
import * as usuariosController from '../controllers/usuarios.controller.js'
import passport from 'passport';

const { Router } = express;
const usuariosRouter = Router()

export const authMw = (req, res, next) => {
    req.isAuthenticated() ? next() : res.render('./login', { error: req.query.error })
}

usuariosRouter
    .get("/", authMw, usuariosController.getMainPage)
    .get("/usuario", authMw, usuariosController.getUserInfo)
    .get("/logout", authMw, usuariosController.getLogoutPage)
    .get("/signup", usuariosController.getSingnUpPage)
    .post("/signup", passport.authenticate("signUp"), usuariosController.redirectToMainPage)
    .post("/cambiarfoto", usuariosController.postNewProfilePictureAndUploadImage)
    .post("/", passport.authenticate("logIn", { failureRedirect: "/?error=true" }), usuariosController.redirectToMainPage)

export { usuariosRouter }