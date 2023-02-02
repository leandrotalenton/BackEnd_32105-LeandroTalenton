import request from 'supertest'
import { HttpServer } from '../src/app.js'


describe('Test de endpoints de productos', async () => {
    it('deberia traer todos los productos', async () => {
        request(HttpServer)
            .get('/api/productos')
            .expect(200)
    })

    let prodId
    it('deberia crear un producto', async () => {
        const postResponse = await request(HttpServer)
            .post('/api/productos')
            .send({
                title: 'test prod',
                price: '1',
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png'
            })
            .expect(201)
            // console.log('postResponse', postResponse)
        prodId = JSON.parse(postResponse.res.text)._id
        console.log('id producot creado: ', prodId)
    })

    it('deberia editar el producto creado anteriormente', async () => {
        const putResponse = await request(HttpServer)
            .put(`/api/productos/${prodId}`)
            .send({
                title: 'test prod modificado',
                price: '2',
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png'
            })
            .expect(200)
            // console.log('putResponse',putResponse)
    })

    it('deberia traer un producto por id', async () => {
        const getResponse = await request(HttpServer)
            .get(`/api/productos/${prodId}`)
            .expect(200)
            // console.log('getResponse',getResponse)
    })

    it('deberia borrar el producto creado anteriormente', async () => {
        const deleteResponse = await request(HttpServer)
            .delete(`/api/productos/${prodId}`)
            .expect(204)
            // console.log('deleteResponse',deleteResponse)
    })
})
