import admin from "firebase-admin"
import config from '../config.js'


admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
    databaseURL: "https://ltbackedn.firebaseio.com" // esto puede que ni lo necesite
})

const db = admin.firestore();

class ContainerFirebase {
    constructor (collectionName){
        this.db = db.collection(collectionName)
    }

    async create(newDocument) {
        try {
            // await this.db.add(newDocument)
        } catch (e) {
            console.log(e)
        }
    }

    async read() {
        try {
            // const querySnapshot = await this.db.get();
            // const objects = querySnapshot.docs;
            // const found = objects.map( obj =>{console.log(obj); return ({ ...obj.data()})}) //id: obj.id,
            return found;
        } catch (e) {
            console.log(e)
        }
    }

    async readById(id) {
        try {
            // const document = await this.db.findOne({_id: id})
            if (document) {
                return document
            }
        } catch (e) {
            console.log(e)
        }
    }

    async updateById(id, newDocument) {
        try {
            // const {modifiedCount} = await this.db.replaceOne({_id: id}, newDocument)
            if ( modifiedCount > 0 ) {
                return `Se ha actualizado el item ${id}`
            } else {
                return `no se encuentra un item con el ID especificado`
            }
        } catch (e) {
            console.log(e)
        }
    }

    async deleteById(id) {
        try {
            // const { deletedCount } = await this.db.deleteOne({_id: id}) //{ n, nDeleted }
            if (deletedCount > 0) {
                return `se elimino el item con ID ${id}`;
            } else {
                return `no se encuentra un item con el ID especificado`
            }
        } catch (e) {
            console.log(e)
        }
    }

    async deleteAll() {
        try {
            // await this.db.deleteMany({})
        } catch (e) {
            console.log(e)
        }
    }
}

export { ContainerFirebase }