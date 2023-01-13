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

// DB
import DAOProductos from "./daos/productos/ProductosDaoMongo.js";
export const DbProductos = new DAOProductos();

import DAOUsuarios from "./daos/usuarios/UsuariosDAO.js";
const MongoUsers = new DAOUsuarios();

import DAOCarritos from "./daos/carritos/CarritosDaoMongo.js";
export const MongoCarritos = new DAOCarritos();

// logger
import logger from "./loggers/configLog4JS.js";

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
app.set("views","./views")
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
        const existantUser = await MongoUsers.readByUsername(username)
        if(existantUser) { return done(null, false) }

        await MongoUsers.create({
            username,
            password: hashPassword(password),
            email: req.body.email,
            age: req.body.age,
            phone: String(req.body.countryCode) + req.body.phone,
            pic: "./images/placeholder.webp"
        })

        const user = await MongoUsers.readByUsername(username)

        await MongoCarritos.create({
            usuarioId: user._id,
            carritoActivo: true,
            productos: []
        })

        return done (null, user)
    })
)

passport.use(
    "logIn",
    new LocalStrategy({}, async (username, password, done) => {
        const user = await MongoUsers.readByUsername(username)
        if (!user || !validatePassword(password, user.password)) { return done(null, false) }

        let carritoActivoExistente = await MongoCarritos.carritoActivoByUserId(user._id)
        if(!carritoActivoExistente) {
            await MongoCarritos.create({
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
    const user = await MongoUsers.readById(someId)
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
import { router as productosRouter } from "./routers/productos.js"
import { router as infoRouter } from "./routers/info.js"
import { router as carritosRouter } from "./routers/carritos.js"
app.use("/api/productos", productosRouter)
app.use("/info", infoRouter)
app.use("/carrito", carritosRouter)

app.get("/", authMw ,async (req, res)=>{
    res.render(`./index`, {
        arrProductos: await DbProductos.read(),
        nombre: req.user.username,
        rank: req.user.rank,
        pic: req.user.pic
    })
})

app.get("/usuario", (req,res)=>{
    res.render("./sobreMi", {
        nombre: req.user.username,
        email: req.user.email,
        edad: req.user.age,
        tel: req.user.phone,
        pic: req.user.pic
    })
})

app.get("/signup", (req,res)=>{
    req.session.destroy()
    res.render("./signUp", { port })
})

app.get("/logout", (req, res)=>{
    let nombre = req.user.username
    req.logOut({},(err)=>{
        if (err) { return next(err); }
        res.render("./logout", { nombre })
    })
})

app.get("/compra", (req, res)=>{
    let nombre = req.user.username
    res.render("./agradecimiento", { nombre })
})

// seteo multer
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



//signUp POST
app.post(
    "/signup",
    passport.authenticate("signUp"),
    async(req, res) => {
        res.redirect("/")
    }
)

//actualizarfoto POST
app.post(
    "/cambiarfoto",
    async (req, res) => {

        upload(req,res,(err)=>{
            if(err) return(res.send({error: true}))
                
            if(req.file == undefined){
                res.send({error: true})
            } else {
                (async ()=>{
                    // console.log("file:",req.file.path)
                    // const newPath = String(req.file.path).substring(7)
                    // console.log(`.\\${newPath}`)
                    await MongoUsers.updatePictureByUsername(req.user.username, `./images/${req.file.filename}`)
                    console.log("se cambia la foto")
                    res.redirect("/")
                })()
            }
        })
    }
)

//login POST
app.post(
    "/",
    passport.authenticate("logIn", {failureRedirect: "/?error=true"}),
    async(req, res) => {
        res.redirect("/")
    }
)

// DAOs
import daos from "./daos/index.js"
const { chatsDAO } = await daos()

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
    socket.emit("new_prod", await DbProductos.read());
    socket.on("new_prod", async (data) => {
        try{
            await DbProductos.create(data);
            const productos = await DbProductos.read();
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

