import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
})

// intento fallido de acceder a endpoints con middleware de autenticacion de passport. se saca middleware a los endpoints de producto
// try {
//     const usuario = await api.post('/', {
//         username: 'juancarlos',
//         password: 'juanca123'
//     })
// } catch (e) {
//     console.log(e)
// }

try{
    const productoDisponiblePorId = await api.get('/api/productos/63bb81a16b7d72717fa7cf22')
    console.log('console.log del get', productoDisponiblePorId.data)
} catch (e) {
    console.log(e)
}

let productoDePrueba

try{
    const incorporacionNuevoProducto = await api.post('/api/productos/', {
        title: 'test prod',
        price: '1',
        thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png'
    })
    productoDePrueba = incorporacionNuevoProducto.data
    console.log('console.log del post', incorporacionNuevoProducto.data)
} catch (e) {
    console.log(e)
}

try{
    const modificacionProducto = await api.put(`/api/productos/${productoDePrueba._id}`, {
        title: 'test prod modificado',
        price: '2',
        thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png'
    })
    console.log('console.log del put', modificacionProducto.data)
} catch (e) {
    console.log(e)
}

try{
    const borradoProducto = await api.delete(`/api/productos/${productoDePrueba._id}`)
    console.log(borradoProducto.data)
} catch (e) {
    console.log(e)
}
