// const { Producto } = require('./producto')

const fs = require("fs");

class Container{
    constructor(file){
        this.file = file;
    }

    // metodo save(object)
    async save(newItem){
        const currentItems = await fs.promises.readFile(this.file, "utf-8");
        const items = JSON.parse(currentItems);
        const id = items.length !== 0? items[items.length-1]?.id+1 : 1;
        newItem.id = id
        items.push(newItem)
        const newItems = JSON.stringify(items)
        await fs.promises.writeFile(this.file,newItems)
    }

    // metodo getById(number)
    async getById(id){
        const currentItems = await fs.promises.readFile(this.file, "utf-8");
        const items = JSON.parse(currentItems);
        const item = items.find(item => item.id === id)
        if(item){
            console.log(`se trajo el item ${item}`)
            return item
        } else {
            console.log(`no se encuentra un item con el ID especificado`)
            return `no se encuentra un item con el ID especificado`
        }
    }

    // metodo editById(number)
    async editById(id, newItem){
        const currentItems = await fs.promises.readFile(this.file, "utf-8");
        const items = JSON.parse(currentItems);
        const item = items.find(item => item.id === id)
        if(item){
            console.log(`se trajo el item ${item}`)
            newItem.id = id
            const index = items.indexOf(items.find(item => item.id === id));
            items.splice(index, 1, newItem);
            const newItems = JSON.stringify(items)
            await fs.promises.writeFile(this.file,newItems)
            return newItem
        } else {
            console.log(`no se encuentra un item con el ID especificado`)
            return `no se encuentra un item con el ID especificado`
        }
    }

    // metodo getAll()
    async getAll(){
        const currentItems = await fs.promises.readFile(this.file, "utf-8");
        const items = JSON.parse(currentItems);
        console.log(`se trajeron los items ${items}`)
        return items
    }

    // metodo deleteById(number)
    async deleteById(id){
        const currentItems = await fs.promises.readFile(this.file, "utf-8");
        const items = JSON.parse(currentItems);
        const index = items.indexOf(items.find(item => item.id === id));
        if (index > -1) { 
            console.log(`se borro el item ${items[index]}`)
            items.splice(index, 1);
        } else {
            console.log(`item no encontrado`)
        }
        const newItems = JSON.stringify(items)
        await fs.promises.writeFile(this.file,newItems)
    }

    // metodo deleteAll()
    async deleteAll(){
        const items = [];
        const newItems = JSON.stringify(items)
        await fs.promises.writeFile(this.file,newItems)
    }
} 

// const contenedor = new Container("./fileStorage/productos.json"); // esta ruta toma como origen a la carpeta donde estoy parado cuando la ejecuto.

// const productin = new Producto("id","timeStamp","name","description","code","picture","price","stock")

// const ejecutar = async function(){
//     await contenedor.save(productin); // por ahora se comenta por q sino se van al chori el numero de productos
//     // await contenedor.getById(2)
//     // await contenedor.getAll()
//     // await contenedor.deleteAll()
//     // await contenedor.deleteById(3)
//     console.log(`no hay problema willy`)

// }
// ejecutar()

module.exports.Container = Container