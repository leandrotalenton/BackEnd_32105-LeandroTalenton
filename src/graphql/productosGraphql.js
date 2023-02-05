import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import { DaoFactory } from '../daos/daoFactory.js';

const productosDAO = DaoFactory.getProductosDao()


const prodSchema = buildSchema(
    `
        type  Product {
            id: String,
            title: String,
            price: String,
            thumbnail: String
        }

        input ProductInput {
            title: String,
            price: String,
            thumbnail: String
        }

        type Query {
            getProduct(id: String!) : Product
            getAllProducts : [Product]
        }

        type Mutation {
            addProduct(data : ProductInput) : Product
            updateProduct(id: String!, data: ProductInput): Product
            deleteProduct(id: String!): String
        }
    `
)
const getProduct = async ({ id }) => {
    return await productosDAO.readById(id)
}
// query {
//     getProduct(id: "63e038265f67e72ea9eedd7e") {
//         id,
//         title,
//         price,
//         thumbnail
//     }
// }

const getAllProducts = async () => {
    return await productosDAO.read()
}
// query {
//     getAllProducts {
//         id,
//         title,
//         price,
//         thumbnail
//     }
// }

const addProduct = async ({ data }) => {
    return await productosDAO.create(data)
}
// mutation {
// 	addProduct(data:{
//     title:"protucto de prueba",
//     price: "999",
//     thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png"
//   }) {
//     id,
// 		title,
//     price,
//     thumbnail
//   }
// }

const updateProduct = async ({ id, data }) => {
    return await productosDAO.updateById(id, data)
}
// mutation {
// 	updateProduct (
//         id: "63e038265f67e72ea9eedd7e"
//         data:{
//             title:"producto editado",
//             price: "1",
//             thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png"
//         }
//     ) {
// 		title,
//         price,
//         thumbnail
//     }
// }

const deleteProduct = async ({ id }) => {
    return await productosDAO.deleteById(id)
}
// mutation {
//     deleteProduct(id: "63e038265f67e72ea9eedd7e")
// }


export const productosGraphQL = graphqlHTTP({
    schema: prodSchema,
    rootValue: {
        getProduct,
        getAllProducts,
        addProduct,
        updateProduct,
        deleteProduct
    },
    graphiql: true
})