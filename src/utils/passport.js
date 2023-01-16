// se agregan las cosas para trabajar con passport-local y encriptador de contrasenias
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import bcrypt from "bcrypt"
import { carritosDAO, usuariosDAO } from '../daos/index.js';
const hashPassword = (pass) => {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null)
}
const validatePassword = (pass, hashedPassword) => {
    return bcrypt.compareSync(pass, hashedPassword)
}

// agrego lo de sendmail
import { sendMail } from '../transportadores/nodeMailer.js'
export const emailAdministrador = "taurean.volkman65@ethereal.email"

passport.use(
    "signUp",
    new LocalStrategy({passReqToCallback: true}, async (req, username, password, done) => {
        const existantUser = await usuariosDAO.readByUsername(username)
        if(existantUser) { return done(null, false) }

        await usuariosDAO.create({
            username,
            password: hashPassword(password),
            email: req.body.email,
            age: req.body.age,
            phone: String(req.body.countryCode) + req.body.phone,
            pic: "./images/placeholder.webp"
        })

        const user = await usuariosDAO.readByUsername(username)

        await carritosDAO.create({
            usuarioId: user._id,
            carritoActivo: true,
            productos: []
        })

        await sendMail(
            emailAdministrador,
            "nuevo registro",
            `<div>se registro el usuario: ${username} de ${req.body.age} años</div>
            <div>email: ${req.body.email}</div>
            <div>telefono: ${String(req.body.countryCode) + req.body.phone}</div>`
        )

        return done (null, user)
    })
)

passport.use(
    "logIn",
    new LocalStrategy({}, async (username, password, done) => {
        const user = await usuariosDAO.readByUsername(username)
        if (!user || !validatePassword(password, user.password)) { return done(null, false) }

        let carritoActivoExistente = await carritosDAO.carritoActivoByUserId(user._id)
        if(!carritoActivoExistente) {
            await carritosDAO.create({
                usuarioId: user._id,
                carritoActivo:  true,
                productos: []
            });
        }

        return done(null, user)
    })
)

passport.serializeUser((userObj, done) => {
    console.log("se ejecuta el serializeUser con esta info: ", userObj)
    done(null, userObj._id)
})

passport.deserializeUser( async(someId, done)=>{
    console.log("se ejecuta el deserializeUser con esta info: ", someId)
    const user = await usuariosDAO.readById(someId)
    console.log("esto me trae el deserializer: ", user)
    done(null, user)
})

export default passport