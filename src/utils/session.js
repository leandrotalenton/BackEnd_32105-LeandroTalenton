import MongoStore from 'connect-mongo';
import logger from '../loggers/configLog4JS.js';
import { yargsResult } from './yargs.js';

const { sessionExpirationTime, environment } = yargsResult

logger.info("environment yargs:",environment)

const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

let mongoUrlEnvSession
if(environment === "DESARROLLO"){
    mongoUrlEnvSession = `mongodb://${process.env.DES_HOST_SPECIFIER}/${process.env.DES_AUTH_DATABASE}`
} else {
    mongoUrlEnvSession = `mongodb+srv://${process.env.DB_SESSION_USER}:${process.env.DB_SESSION_PASS}@cluster${process.env.DB_SESSION_CLUSTERNAME}.fyskstk.mongodb.net/${process.env.DB_SESSION_NAME}`
}

export const sessionObj = {
    secret: "secret123123",
    store: MongoStore.create({
        mongoUrl: mongoUrlEnvSession,
        mongoOptions,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: sessionExpirationTime } // default 10min
}