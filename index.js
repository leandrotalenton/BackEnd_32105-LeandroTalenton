// express 
import express from 'express'
import { Server as HTTPServer } from "http";
import { Server } from 'socket.io';
import path from 'path'
import session from 'express-session';
import * as dotenv from "dotenv";
import cluster from 'cluster';

import { carritosDAO, chatsDAO, productosDAO, usuariosDAO } from './src/daos/index.js'
import logger from "./src/loggers/configLog4JS.js";
import { yargsResult } from './src/utils/yargs.js';
import { sessionObj } from './src/utils/session.js'
import passport from './src/utils/passport.js'
import { createSocketsChatsProductos } from './src/utils/sockets.js';
import { router as usuariosRouter, authMw } from "./src/routers/usuarios.js"
import { router as productosRouter } from "./src/routers/productos.js"
import { router as infoRouter } from "./src/routers/info.js"
import { router as carritosRouter } from "./src/routers/carritos.js"

const app = express();
const HttpServer = new HTTPServer(app)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const io = new Server(HttpServer)
const { port, method } = yargsResult


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


dotenv.config();

app.use(session(sessionObj))

app.use(passport.initialize())
app.use(passport.session())

createSocketsChatsProductos()

app.use("/", usuariosRouter)
app.use("/api/productos", authMw, productosRouter)
app.use("/carrito", authMw, carritosRouter)
app.use("/info", infoRouter)

app.all("*", (req, res, next) => {
    logger.warn(`request fallida: ${req.method}, a la URL: ${req.url}`);
    res.send({ error: true }).status(500);
    next();
})

// server listen
if (method == "CLUSTER") {
    if (cluster.isPrimary) {
        console.log(`Cluster Primary ${process.pid} corriendo`);
        for (let i = 0; i < 3; i += 1) {
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
    HttpServer.listen(port, () => {
        console.log(`servidor iniciado en el puerto ${port} con el metodo ${method}`)
    })
}