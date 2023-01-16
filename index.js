// express 
import express from 'express'
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// socket.io (config)
import { Server as HTTPServer } from "http";
import { Server } from 'socket.io';
const HttpServer = new HTTPServer(app)
export const io = new Server(HttpServer)

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

import * as dotenv from "dotenv";
dotenv.config();

import { sessionObj } from './src/utils/session.js'
app.use(session(sessionObj))

import passport from './src/utils/passport.js'

app.use(passport.initialize())
app.use(passport.session())

import { createSocketsChatsProductos } from './src/utils/sockets.js';
createSocketsChatsProductos()

// routers
import { router as usuariosRouter, authMw } from "./src/routers/usuarios.js"
import { router as productosRouter } from "./src/routers/productos.js"
import { router as infoRouter } from "./src/routers/info.js"
import { router as carritosRouter } from "./src/routers/carritos.js"
app.use("/", usuariosRouter)
app.use("/api/productos", authMw, productosRouter)
app.use("/carrito", authMw, carritosRouter)
app.use("/info", infoRouter)



app.all("*", (req, res, next) => {
    logger.warn(`request fallida: ${req.method}, a la URL: ${req.url}`);
    res.send({ error:true }).status(500);
    next();
})


// server listen
import cluster from 'cluster';
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

