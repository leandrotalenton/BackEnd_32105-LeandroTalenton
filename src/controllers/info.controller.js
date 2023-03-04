import { yargsResult } from "../utils/yargs.js";

const { port, method, sessionExpirationTime, environment, emailAdress } =
  yargsResult;

export const getInfo = async (req, res) => {
  try {
    const data = {
      port,
      method,
      sessionExpirationTime,
      DB: process.env.TIPO,
      environment,
      emailAdress,
    };
    res.render("./info", data);
  } catch (err) {
    res.status(404).send(err);
  }
};
