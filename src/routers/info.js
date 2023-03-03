import express from 'express';
import * as infoController from '../controllers/info.controller.js'

const {Router} = express;
const infoRouter = Router()


infoRouter.get("/", infoController.getInfo)

export { infoRouter }