import { upload } from '../utils/multer.js';
import { DaoFactory } from '../daos/daoFactory.js';
import { GetMeDTO } from '../dtos/usuarios/usuario.dto.js';
import { updatePictureByUsername } from '../services/usuarios.service.js';

const productosDAO = DaoFactory.getProductosDao()
const usuariosDAO = DaoFactory.getUsuariosDao()

export const getMainPage = async (req, res) => {
    res.render(`./index`, {
        arrProductos: await productosDAO.read(),
        nombre: req.user.username,
        rank: req.user.rank,
        pic: req.user.pic
    })
}

export const getUserInfo = (req, res) => {
    const user = new GetMeDTO(req.user)
    res.render("./sobreMi", { ...user })
}

export const getSingnUpPage = (req, res) => {
    req.session.destroy()
    res.render("./signUp")
}

export const getLogoutPage = (req, res) => {
    let nombre = req.user.username
    req.logOut({}, (err) => {
        if (err) { return next(err); }
        res.render("./logout", { nombre })
    })
}

//signUp POST
export const redirectToMainPage = async (req, res) => {
    res.redirect("/")
}

//actualizarfoto POST
export const postNewProfilePictureAndUploadImage = async (req, res) => {

    upload(req, res, (err) => {
        if (err) return (res.send({ error: true }))

        if (req.file == undefined) {
            res.send({ error: true })
        } else {
            (async () => {
                await updatePictureByUsername(req.user.username, `./images/${req.file.filename}`)
                console.log("se cambia la foto")
                res.redirect("/")
            })()
        }
    })
}