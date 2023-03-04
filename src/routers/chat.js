import express from "express";
import * as chatController from "../controllers/chat.controller.js";

const { Router } = express;
const chatRouter = Router();

export const authMw = (req, res, next) => {
  req.isAuthenticated()
    ? next()
    : res.render("./login", { error: req.query.error });
};

chatRouter
  .get("/", authMw, chatController.getChatGeneral)
  .get("/:destinatario", authMw, chatController.getChatIndividual);

export { chatRouter };
