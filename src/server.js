import cluster from "cluster";

import { HttpServer } from "./app.js";
import logger from "./loggers/configLog4JS.js";
import { yargsResult } from "./utils/yargs.js";

const { port, method } = yargsResult;

// server listen
if (method == "CLUSTER") {
  if (cluster.isPrimary) {
    logger.info(`Cluster Primary ${process.pid} corriendo`);
    for (let i = 0; i < 3; i += 1) {
      cluster.fork();
    }
    cluster.on("exit", (worker) => {
      logger.info(`Worker ${worker.process.pid} se ha caido`);
    });
  } else {
    //worker
    HttpServer.listen(port, () => {
      logger.info(
        `servidor iniciado en el puerto ${port} con el metodo ${method}, en el worker ${process.pid}`
      );
    });
  }
} else {
  HttpServer.listen(port, () => {
    logger.info(
      `servidor iniciado en el puerto ${port} con el metodo ${method}`
    );
  });
}
