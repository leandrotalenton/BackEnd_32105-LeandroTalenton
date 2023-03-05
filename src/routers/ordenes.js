import express from "express";
import * as ordenesController from "../controllers/ordenes.controller.js";

const { Router } = express;
const ordenesRouter = Router();

ordenesRouter
  .get("/", ordenesController.getUserOrders)
  .get("/:id_orden", ordenesController.getOrderData)

export { ordenesRouter };
