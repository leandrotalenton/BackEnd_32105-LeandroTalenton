// const { Producto } = require('./producto')

const fs = require("fs");

class Container{
    constructor(file){
        this.file = file;
    }

    // metodo save(object)
    async save(newProduct){
        const currentProducts = await fs.promises.readFile(this.file, "utf-8");
        const products = JSON.parse(currentProducts);
        const id = products.length !== 0? products[products.length-1]?.id+1 : 1;
        newProduct.id = id
        products.push(newProduct)
        const newProducts = JSON.stringify(products)
        await fs.promises.writeFile(this.file,newProducts)
    }

    // metodo getById(number)
    async getById(id){
        const currentProducts = await fs.promises.readFile(this.file, "utf-8");
        const products = JSON.parse(currentProducts);
        const product = products.find(product => product.id === id)
        if(product){
            console.log(`se trajo el producto ${product}`)
            return product
        } else {
            console.log(`no se encuentra un producto con el ID especificado`)
            return `no se encuentra un producto con el ID especificado`
        }
    }

    // metodo putById(number)
    async putById(id, newProduct){
        const currentProducts = await fs.promises.readFile(this.file, "utf-8");
        const products = JSON.parse(currentProducts);
        const product = products.find(product => product.id === id)
        if(product){
            console.log(`se trajo el producto ${product}`)
            newProduct.id = id
            //delete old
            const index = products.indexOf(products.find(product => product.id === id));
            console.log(`se borro el producto ${products[index]}`)
            products.splice(index, 1);
            //push new
            products.push(newProduct)
            const newProducts = JSON.stringify(products)
            await fs.promises.writeFile(this.file,newProducts)
            return newProduct
        } else {
            console.log(`no se encuentra un producto con el ID especificado`)
            return `no se encuentra un producto con el ID especificado`
        }
    }

    // metodo getAll()
    async getAll(){
        const currentProducts = await fs.promises.readFile(this.file, "utf-8");
        const products = JSON.parse(currentProducts);
        console.log(`se trajeron los productos ${products}`)
        return products
    }

    // metodo deleteById(number)
    async deleteById(id){
        const currentProducts = await fs.promises.readFile(this.file, "utf-8");
        const products = JSON.parse(currentProducts);
        const index = products.indexOf(products.find(product => product.id === id));
        if (index > -1) { 
            console.log(`se borro el producto ${products[index]}`)
            products.splice(index, 1);
        } else {
            console.log(`producto no encontrado`)
        }
        const newProducts = JSON.stringify(products)
        await fs.promises.writeFile(this.file,newProducts)
    }

    // metodo deleteAll()
    async deleteAll(){
        const products = [];
        const newProducts = JSON.stringify(products)
        await fs.promises.writeFile(this.file,newProducts)
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