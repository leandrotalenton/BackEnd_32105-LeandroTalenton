// se cambia el nombre del file
import mongoose from 'mongoose'
import logger from "../loggers/configLog4JS.js";
import { yargsResult } from '../utils/yargs.js';
import { ContainerFactory } from './ContainerFactory.js';


const { environment } = yargsResult

let mongoUrlEnvSession
if( environment === "DESARROLLO" ){
    mongoUrlEnvSession = `mongodb://${process.env.DES_HOST_SPECIFIER}/${process.env.DES_AUTH_DATABASE}`
} else {
    mongoUrlEnvSession = `mongodb+srv://${process.env.DB_SESSION_USER}:${process.env.DB_SESSION_PASS}@cluster${process.env.DB_SESSION_CLUSTERNAME}.fyskstk.mongodb.net/${process.env.DB_SESSION_NAME}`
}


await mongoose.connect(mongoUrlEnvSession, { serverSelectionTimeoutMS: 4000 })

class ContainerMongoDb extends ContainerFactory{
    constructor(collection, scheme) {
        super();
        this.db = mongoose.model(collection, scheme)
    }

    async create(newDocument) {
        try {
            const document = await this.db.create(newDocument)
            return document
        } catch (e) {
            logger.error(`Api de mensajes: ${e}`)
        }
    }

    async read() {
        try {
            const documents = await this.db.find({})
            return documents
        } catch (e) {
            logger.error(`Api de mensajes: ${e}`)
        }
    }

    async readById(id) {
        try {
            const document = await this.db.findOne({_id: id})
            if (document) {
                return document
            }
        } catch (e) {
            logger.error(`Api de mensajes: ${e}`)
        }
    }

    async updateById(id, newDocument) {
        try {
            const { modifiedCount } = await this.db.replaceOne({_id: id}, newDocument)
            if ( modifiedCount > 0 ) {
                console.log(`Se ha actualizado el item ${id}`)
                return newDocument
            } else {
                return `no se encuentra un item con el ID especificado`
            }
        } catch (e) {
            logger.error(`Api de mensajes: ${e}`)
        }
    }

    async deleteById(id) {
        try {
            const { deletedCount } = await this.db.deleteOne({_id: id}) //{ n, nDeleted }
            if (deletedCount > 0) {
                return `se elimino el item con ID ${id}`;
            } else {
                return `no se encuentra un item con el ID especificado`
            }
        } catch (e) {
            logger.error(`Api de mensajes: ${e}`)
        }
    }

    async deleteAll() {
        try {
            await this.db.deleteMany({})
        } catch (e) {
            logger.error(`Api de mensajes: ${e}`)
        }
    }
}

export { ContainerMongoDb }