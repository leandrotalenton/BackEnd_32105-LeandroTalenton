import express from 'express';
import * as infoController from '../controllers/info.controller.js'
// import compression from "compression";

const {Router} = express;
const infoRouter = Router()

// sin compresion: 638 B
// con compresion: 661 B <-- la info que se enviaba parece ser demasiado pequeña como para que el middleware de compression pueda comprimirla

infoRouter.get("/", /* compression(), */ infoController.getInfo)

export { infoRouter }