import { cpus } from "os";
const cpu = cpus()

export const getInfo = async (req,res)=>{
    try{
        const data = {
            argumentosDeEntrada: process.argv.slice(2),
            nombreDeLaPlataforma: process.platform,
            versionDeNode: process.version,
            memoriaTotalReservada: process.memoryUsage(),
            pathDeEjecucion: process.execPath,
            processId: process.pid,
            carpetaDelProyecto: process.cwd(),
            cantidadDeProcesadores: cpu.length
        }
        // console.log(data)
        res.send(data)
    } catch(err) {
        res.status(404).send(err)
    }
}