import Yargs from "yargs/yargs"
const yargs = Yargs(process.argv.slice(2))
export const yargsResult = yargs
    .alias({
        p: "port",
        m: "method"
    })
    .default({
        port: process.env.PORT || 8080,
        method: "FORK"
    })
    .argv