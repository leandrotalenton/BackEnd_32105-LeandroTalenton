import admin from "firebase-admin"
import config from '../config.js'


admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
    databaseURL: "https://ltbackedn.firebaseio.com"
})

const db = admin.firestore();

class ContainerFirebase {
    constructor (collectionName){
        this.collection = db.collection(collectionName)
    }

    async create(newDocument) {
        try {
            const { id } = await this.collection.add({})
            await this.collection.doc(id).set({...newDocument, id: id})
        } catch (e) {
            console.log(e)
        }
    }

    async read() {
        try {
            const docArray = []
            const docs = await this.collection.get();
            docs.forEach( doc => docArray.push(doc.data()))
            return docArray;
        } catch (e) {
            console.log(e)
        }
    }

    async readById(id) {
        try {
            const doc = await this.collection.doc(id).get();
            const docData = doc.data()
            if (docData) {
                return docData
            }
        } catch (e) {
            console.log(e)
        }
    }

    async updateById(id, newDocument) {
        try {
            const doc = await this.collection.doc(id).get();
            if ( doc.data() ) {
                await this.collection.doc(id).set({...newDocument, id: doc.id})
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
            const doc = await this.collection.doc(id).get();
            if ( doc.data() ) {
                await this.collection.doc(id).delete();
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
            await this.collection.delete();
        } catch (e) {
            console.log(e)
        }
    }
}

export { ContainerFirebase }