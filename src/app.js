import express from 'express'
import { Server as HTTPServer } from "http";
import { Server } from 'socket.io';
import path from 'path'
import session from 'express-session';

import {} from './utils/dotenv.js' // tengo conflictos cuando la configuracion de dotEnv no viene de un file externo, por lo que lei a otra gente tambien le pasa: https://github.com/motdotla/dotenv/issues/89
import logger from "./loggers/configLog4JS.js";
import { sessionObj } from './utils/session.js'
import passport from './utils/passport.js'
import { createSocketsChatsProductos } from './utils/sockets.js';
import { usuariosRouter, authMw } from "./routers/usuarios.js"
import { productosRouter } from "./routers/productos.js"
import { infoRouter } from "./routers/info.js"
import { carritosRouter } from "./routers/carritos.js"
// import cors from 'cors'

const app = express();
export const HttpServer = new HTTPServer(app)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

export const io = new Server(HttpServer)


// convert a connect middleware to a Socket.IO middleware
// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
// io.use(wrap(sessionObj));

// // only allow authenticated users
// io.use((socket, next) => {
//     const session = socket.request.session;
//     if (session && session.authenticated) {
//         next();
//     } else {
//         next(new Error("unauthorized"));
//     }
// });


app.use((req, res, next) => {
    logger.info(`Request con metodo: ${req.method}, a la URL: ${req.url}`)
    next();
});

// static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));
// template engines
app.set("views", "./src/views")
app.set("view engine", "ejs")

app.use(session(sessionObj))

app.use(passport.initialize())
app.use(passport.session())

createSocketsChatsProductos()

app.use("/", usuariosRouter)
app.use("/productos", authMw, productosRouter)
app.use("/carrito", authMw, carritosRouter)
app.use("/info", infoRouter)

app.all("*", (req, res, next) => {
    logger.warn(`request fallida: ${req.method}, a la URL: ${req.url}`);
    res.send({ error: true }).status(500);
    next();
})
