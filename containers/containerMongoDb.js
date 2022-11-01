import mongoose from 'mongoose'
import config from '../config.js'

await mongoose.connect(config.mongoDb.uri, config.mongoDb.options)

class Container {
    constructor(collection, scheme) {
        this.db = mongoose.model(collection, scheme)
    }

    async create(newDocument) {
        try {
            await this.db.create(newDocument)
        } catch (e) {
            console.log(e)
        }
    }

    async read() {
        try {
            const documents = await this.db.find({})
            return documents
        } catch (e) {
            console.log(e)
        }
    }

    async readById(id) {
        try {
            const document = await this.db.findOne({ _id: id})
            if (document) {
                return document
            }
        } catch (e) {
            console.log(e)
        }
    }

    async updateById(id, newDocument) {
        try {
            const aver = await this.db.replaceOne({_id: id}, newDocument)
            console.log(aver)
            // REVISAR ESTO EN FS (perate capaz lo puedo usar, voy a revisar esto y destructurar algo que encuentre util)
            // if (item) {
            //     return `Se ha actualizado el item ${id}`
            // } else {
            //     return `no se encuentra un item con el ID especificado`
            // }
        } catch (e) {
            console.log(e)
        }
    }

    async deleteById(id) {
        try {
            const { n, nDeleted } = await this.db.deleteOne({_id: id})
            console.log(aver)
            if (nDeleted > 0) {
                return `se elimino el producto con ID ${id}`;
            } else {
                return `no se encuentra un item con el ID especificado`
            }
        } catch (e) {
            console.log(e)
        }
    }

    async deleteAll() {
        try {
            await this.db.deleteMany({})
        } catch (e) {
            console.log(e)
        }
    }
}

export { Container }