import express from 'express'
// import { authMw } from '../../index.js';
import passport from 'passport';
import { DaoFactory } from '../daos/daoFactory.js';
import { GetMeDTO } from '../dtos/usuarios/usuario.dto.js';
const {Router} = express;
const router = Router()

const productosDAO = DaoFactory.getProductosDao()
const usuariosDAO = DaoFactory.getUsuariosDao()

export const authMw = (req, res, next) => {
    req.isAuthenticated() ? next() : res.render('./login', { error: req.query.error } )
}

router.get("/", authMw ,async (req, res)=>{
    res.render(`./index`, {
        arrProductos: await productosDAO.read(),
        nombre: req.user.username,
        rank: req.user.rank,
        pic: req.user.pic
    })
})

router.get("/usuario", authMw, (req,res)=>{
    const user = new GetMeDTO(req.user)
    res.render("./sobreMi", {...user})
})

router.get("/signup", (req,res)=>{
    req.session.destroy()
    res.render("./signUp")
})

router.get("/logout", authMw, (req, res)=>{
    let nombre = req.user.username
    req.logOut({},(err)=>{
        if (err) { return next(err); }
        res.render("./logout", { nombre })
    })
})

//signUp POST
router.post(
    "/signup",
    passport.authenticate("signUp"),
    async(req, res) => {
        res.redirect("/")
    }
)

//actualizarfoto POST
import { upload } from '../utils/multer.js' //'./src/utils/multerDiskStorage.js';

router.post(
    "/cambiarfoto",
    async (req, res) => {

        upload(req,res,(err)=>{
            if(err) return(res.send({error: true}))
                
            if(req.file == undefined){
                res.send({error: true})
            } else {
                (async ()=>{
                    await usuariosDAO.updatePictureByUsername(req.user.username, `./images/${req.file.filename}`)
                    console.log("se cambia la foto")
                    res.redirect("/")
                })()
            }
        })
    }
)

//login POST
router.post(
    "/",
    passport.authenticate("logIn", {failureRedirect: "/?error=true"}),
    async(req, res) => {
        res.redirect("/")
    }
)

export { router }