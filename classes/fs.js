const fs = require("fs");

class Container{
    constructor(file){
        this.file = file;
    }

    // metodo save(object)
    async save(newProduct){
        const currentProducts = await fs.promises.readFile(this.file, "utf-8");
        const products = JSON.parse(currentProducts);
        const id = products.length + 1;
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
            console.log(product)
        } else {
            console.log(`no se encuentra un producto con el ID especificado`)
        }
    }

    // metodo getAll()
    async getAll(){
        const currentProducts = await fs.promises.readFile(this.file, "utf-8");
        const products = JSON.parse(currentProducts);
        console.log(products)
    }

    // metodo deleteById(number)
    async deleteById(id){
        const currentProducts = await fs.promises.readFile(this.file, "utf-8");
        const products = JSON.parse(currentProducts);
        const index = products.indexOf(products.find(product => product.id === id));
        if (index > -1) { 
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

// const fileProductos = "desafio2/productos.json";
// const contenedor = new Container(fileProductos);

// const objA = {
//     title: "objetoA",
//     price: 10,
//     thumbnail: "este es el objeto A"
// }

// const ejecutar = async function(){
//     await contenedor.save(objA); // por ahora se comenta por q sino se van al chori el numero de productos
//     // await contenedor.getById(2)
//     // await contenedor.getAll()
//     // await contenedor.deleteAll()
//     // await contenedor.deleteById(3)
//     console.log(`no hay problema willy`)

// }
// ejecutar()