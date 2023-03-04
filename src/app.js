import express from "express";
import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import path from "path";
import session from "express-session";

import {} from "./utils/dotenv.js";
import logger from "./loggers/configLog4JS.js";
import { sessionObj } from "./utils/session.js";
import passport from "./utils/passport.js";
import { createSocketsChatsProductos } from "./utils/sockets.js";
import { usuariosRouter, authMw } from "./routers/usuarios.js";
import { productosRouter } from "./routers/productos.js";
import { infoRouter } from "./routers/info.js";
import { carritosRouter } from "./routers/carritos.js";
import { chatRouter } from "./routers/chat.js";

const app = express();
export const HttpServer = new HTTPServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const io = new Server(HttpServer);

app.use((req, res, next) => {
  // logger.info(`Request con metodo: ${req.method}, a la URL: ${req.url}`)
  next();
});

// static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// template engines
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(session(sessionObj));

app.use(passport.initialize());
app.use(passport.session());

createSocketsChatsProductos();

app.use("/", usuariosRouter);
app.use("/chat", chatRouter);
app.use("/productos", authMw, productosRouter);
app.use("/carrito", authMw, carritosRouter);
app.use("/info", infoRouter);

app.all("*", (req, res, next) => {
  logger.warn(`request fallida: ${req.method}, a la URL: ${req.url}`);
  res.send({ error: true }).status(500);
  next();
});
