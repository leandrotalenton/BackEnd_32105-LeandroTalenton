import request from 'supertest'
import { HttpServer } from '../src/app.js'


describe('Test de endpoints de productos', async () => {
    it('deberia traer todos los productos', async () => {
        request(HttpServer)
            .get('/productos')
            .expect(200)
    })

    let prodId
    it('deberia crear un producto', async () => {
        const postResponse = await request(HttpServer)
            .post('/productos')
            .send({
                title: 'test prod',
                price: '1',
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png'
            })
            .expect(201)
        prodId = JSON.parse(postResponse.res.text)._id
        console.log('id producot creado: ', prodId)
    })

    it('deberia editar el producto creado anteriormente', async () => {
        await request(HttpServer)
            .put(`/productos/${prodId}`)
            .send({
                title: 'test prod modificado',
                price: '2',
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png'
            })
            .expect(200)
    })

    it('deberia traer un 404 al poder editar un producto que no existe', async () => {
        await request(HttpServer)
            .put(`/productos/prodInexistente`)
            .send({
                title: 'test prod modificado',
                price: '2',
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png'
            })
            .expect(404)
    })

    it('deberia traer un producto por id', async () => {
        await request(HttpServer)
            .get(`/productos/${prodId}`)
            .expect(200)
    })
    
    it('deberia traer un 404 al no encontrar un producto que no existe', async () => {
        await request(HttpServer)
            .get(`/productos/prodInexistente`)
            .expect(404)
    })

    it('deberia borrar el producto creado anteriormente', async () => {
        await request(HttpServer)
            .delete(`/productos/${prodId}`)
            .expect(204)
    })

    it('deberia traer un 404 al no poder borrar un producto que no existe', async () => {
        await request(HttpServer)
            .delete(`/productos/prodInexistente`)
            .expect(404)
    })
})
