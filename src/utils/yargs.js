import Yargs from "yargs/yargs"
const yargs = Yargs(process.argv.slice(2))
export const yargsResult = yargs
    .alias({
        p: "port",
        m: "method",
        t: "sessionExpirationTime",
        e: "environment",
        a: "emailAdress"
    })
    .default({
        port: process.env.PORT || 8080,
        method: "FORK",
        sessionExpirationTime: 600000,
        environment: "PRODUCCION",
        emailAdress: "taurean.volkman65@ethereal.email"
    })
    .argv