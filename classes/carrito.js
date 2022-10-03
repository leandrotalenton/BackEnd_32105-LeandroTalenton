// const { Producto } = require('./producto')

class Carrito {
    constructor(id, timeStamp, productos){
        this.id = id,
        this.timeStamp = timeStamp,
        this.productos = productos
    };

    // productos = [
    //     {
    //         id: addedProd.id,
    //         timeStamp: Date.now(),
    //         quantity: addedProdQuantity
    //     },
    //     {
    //         id: addedProd.id,
    //         timeStamp: Date.now(),
    //         quantity: addedProdQuantity
    //     }
    // ]

    // esta es una funcion a la que se le pasa un objecto con una prop .id y retorna el objecto completo (si lo encuentra) o undefined (si no lo encuentra)
    isInCart(prod){
        return this.productos.find((existProd)=>existProd.id === prod.id) // if found => {id:...} || if not found => undefined
    }

    addToCart(addedProd/* ={id:1} */, addedProdQuantity/* =1 */){
        const productoIsInCart = this.isInCart(addedProd) 
        if(!productoIsInCart){ // if !undefined => create new producto || else increase prod cuantity
            this.productos.push({
                id: addedProd.id,
                timeStamp: Date.now(),
                quantity: addedProdQuantity
            })
        } else {
            const index = this.productos.findIndex((existProd)=>existProd.id === productoIsInCart.id)
            this.productos[index].quantity += addedProdQuantity // increase quantity
            this.productos[index].timeStamp = Date.now() // update timeStamp (assuming it refers to last modification)
        }
    }

    deleteFromCart(deletedProd){
        const productoIsInCart = this.isInCart(deletedProd)
        const index = this.productos.findIndex((existProd)=>existProd.id === productoIsInCart.id)
        if(productoIsInCart){
            this.productos.splice(index,1)
        }
    }

    deleteCart(){
        this.productos = []
    }
}

// const productin = new Producto("id","timeStamp","name","description","code","picture","price","stock")
// const carrin = new Carrito("id",Date.now())
// carrin.addToCart(productin)
// carrin.addToCart(productin)
// carrin.addToCart({id:2})
// carrin.addToCart({id:3})
// carrin.addToCart({id:2})
// carrin.deleteFromCart({id:2})
// console.log(carrin)

module.exports.Carrito = Carrito