// express 
import express from 'express'
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// socket.io (config)
import { Server as HTTPServer } from "http";
import { Server } from 'socket.io';
const HttpServer = new HTTPServer(app)
const io = new Server(HttpServer)

// DAOs
// import daos from "./src/daos/index.js"
import { carritosDAO, chatsDAO, productosDAO, usuariosDAO } from './src/daos/index.js' // esta linea deberia salir de aca y estar solo en los routers o donde se lo necesite


// logger
import logger from "./src/loggers/configLog4JS.js"; // esta linea deberia salir de aca y estar donde se la necesite

app.use((req, res, next) => {
    logger.info(`Request con metodo: ${req.method}, a la URL: ${req.url}`)
    next();
});

import Yargs from "yargs/yargs"
const yargs = Yargs(process.argv.slice(2))
const result = yargs
    .alias({
        p: "port",
        m: "method"
    })
    .default({
        port: process.env.PORT || 8080,
        method: "FORK"
    })
    .argv

const { port, method } = result

// static files
import path from 'path'
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

// template engines
app.set("views","./src/views")
app.set("view engine","ejs")

// esto se agrega para utilizar sessions con mongoAtlas
import session from 'express-session';
import MongoStore from 'connect-mongo';
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

import * as dotenv from "dotenv";
dotenv.config();

app.use(session({
    secret: "secret123123",
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${process.env.DB_SESSION_USER}:${process.env.DB_SESSION_PASS}@cluster${process.env.DB_SESSION_CLUSTERNAME}.fyskstk.mongodb.net/${process.env.DB_SESSION_NAME}`,
        // mongoUrl: "mongodb+srv://LeandroCoder:Coder123123@clusterleandrocoder.fyskstk.mongodb.net/leandroCoderDb",
        mongoOptions,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 } // 10min
}))


// agrego lo de sendmail
import { sendMail } from './src/transportadores/nodeMailer.js';
export const emailAdministrador = "taurean.volkman65@ethereal.email"


// se agregan las cosas para trabajar con passport-local y encriptador de contrasenias
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import bcrypt from "bcrypt"
const hashPassword = (pass) => {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null)
}
const validatePassword = (pass, hashedPassword) => {
    return bcrypt.compareSync(pass, hashedPassword)
}

passport.use(
    "signUp",
    new LocalStrategy({passReqToCallback: true}, async (req, username, password, done) => {
        console.log("arranca signUpsignUpsignUpsignUpsignUpsignUpsignUpsignUpsignUp")
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

app.use(passport.initialize())
app.use(passport.session())

//routes
const authMw = (req, res, next) => {
    req.isAuthenticated() ? next() : res.render('./login', { error: req.query.error, port } )
}

// routers
import { router as productosRouter } from "./src/routers/productos.js"
import { router as infoRouter } from "./src/routers/info.js"
import { router as carritosRouter } from "./src/routers/carritos.js"
app.use("/api/productos", productosRouter)
app.use("/info", infoRouter)
app.use("/carrito", carritosRouter)

app.get("/", authMw ,async (req, res)=>{
    res.render(`./index`, {
        arrProductos: await productosDAO.read(),
        nombre: req.user.username,
        rank: req.user.rank,
        pic: req.user.pic
    })
})

app.get("/usuario", (req,res)=>{ // <-- usuario
    res.render("./sobreMi", {
        nombre: req.user.username,
        email: req.user.email,
        edad: req.user.age,
        tel: req.user.phone,
        pic: req.user.pic
    })
})

app.get("/signup", (req,res)=>{ // <-- usuario
    req.session.destroy()
    res.render("./signUp", { port })
})

app.get("/logout", (req, res)=>{ // <-- usuario
    let nombre = req.user.username
    req.logOut({},(err)=>{
        if (err) { return next(err); }
        res.render("./logout", { nombre })
    })
})

app.get("/compra", (req, res)=>{ // <-- carrito o usuario?
    let nombre = req.user.username
    res.render("./agradecimiento", { nombre })
})


//signUp POST  <-- usuarios
app.post(
    "/signup",
    passport.authenticate("signUp"),
    async(req, res) => {
        res.redirect("/")
    }
)

// seteo multer <-- iria a utils (es users y tambien prod eventualmente)
import multer from 'multer';

const storage = multer.diskStorage({
    destination: './public/images',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if(mimetype && extname){
        return cb(null, true)
    }else{
        cb('Error: Solo se permiten imagenes!')
    }
}

const upload = multer({
    storage: storage,
    limits:{fieldSize: 1000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('myImage')


//actualizarfoto POST  <-- usuarios
app.post(
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

//login POST <-- usuarios
app.post(
    "/",
    passport.authenticate("logIn", {failureRedirect: "/?error=true"}),
    async(req, res) => {
        res.redirect("/")
    }
)



// normalizr

import util from 'util'
import { normalize, denormalize, schema } from 'normalizr';
const autoresSchema = new schema.Entity("autores");
const chatsSchema = new schema.Entity("chats", {mensajes:[{autor:autoresSchema}]});

io.on('connection', async (socket)=>{
    console.log(`Cliente conectado, id: ${socket.id}`)

    // chat <-- el deserializador seguramente se rompio con el cambio de DB, si tnego tiempo despues lo reviso
    socket.emit("new_msg", normalize({id: 'chats', mensajes: await chatsDAO.read() }, chatsSchema));
    socket.on("new_msg", async (data) => {
        try{
            const currDate = new Date()
            data.date= `${currDate.toLocaleString()}`
            await chatsDAO.create(data)
            const mensajesNormalizados = normalize({id: 'chats', mensajes: await chatsDAO.read() }, chatsSchema)
            // console.log("mensajesNormalizados: ", util.inspect(mensajesNormalizados, false, 10, true ))
            io.sockets.emit("new_msg", mensajesNormalizados);
        } catch(err) {
            console.log(err)
        }
    });

    // prod
    socket.emit("new_prod", await productosDAO.read());
    socket.on("new_prod", async (data) => {
        try{
            await productosDAO.create(data);
            const productos = await productosDAO.read();
            io.sockets.emit('new_prod', productos);
        } catch(err) {
            console.log(err)
        }
    });
})

app.all("*", (req, res, next) => {
    logger.warn(`request fallida: ${req.method}, a la URL: ${req.url}`);
    res.send({ error:true }).status(500);
    next();
})

import cluster from 'cluster';

// server listen
if(method == "CLUSTER"){
    if (cluster.isPrimary) {
        console.log(`Cluster Primary ${process.pid} corriendo`);
        for (let i = 0; i < 3; i+=1) {
            cluster.fork();
        }
        cluster.on('exit', (worker) => {
            console.log(`Worker ${worker.process.pid} se ha caido`);
        })
    } else {
        //worker
        HttpServer.listen(port, () => {
            console.log(`servidor iniciado en el puerto ${port} con el metodo ${method}, en el worker ${process.pid}`)
        });
    }
} else {
    HttpServer.listen(port, ()=>{
        console.log(`servidor iniciado en el puerto ${port} con el metodo ${method}`)
    })
}

