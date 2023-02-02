import request from 'supertest'
// import { strict as assert } from 'node:assert'
import { HttpServer } from '../src/app.js'


describe('Test de endpoints de productos', async () => {
    let prodId = '63db24ca58f480e9e2ed2b21'
    it('deberia renderizar todos los productos', () => {
        request(HttpServer)
            .get('/api/productos')
            .expect(200)
            .end((err, res) => {
                if (err) throw err
            })
    })
    it('deberia traer un solo producto', () => {
        request(HttpServer)
            .get(`/api/productos/${prodId}`)
            .expect(200)
            .end((err, res) => {
                if (err) throw err
            })
    })
    it('deberia crear un nuevo producto', () => {
        request(HttpServer)
            .post('/api/productos')
            .send({
                title: 'test prod',
                price: '1',
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png'
            })
            .expect(201)
            .end((err, res) => {
                // console.log('JSON.parse(res.text)._id', JSON.parse(res.text)._id)
                if (err) throw err
            })
    })
    console.log()
    it('deberia editar un producto por id', () => {
        request(HttpServer)
            .put(`/api/productos/${prodId}`)
            .send({
                title: 'test prod modificado',
                price: '2',
                thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png'
            })
            .expect(200)
            .end((err, res) => {
                if (err) throw err
            })
    })
    it('deberia eliminar un producto por id', () => {
        request(HttpServer)
            .delete(`/api/productos/${prodId}`)
            .expect(200)
            .end((err, res) => {
                if (err) throw err
            })
    })

})
