import Koa from 'koa'
import {koaBody} from 'koa-body'
import {productosRouterKoa} from './routers/productosKoa.js'


const app = new Koa()
app.use(koaBody())
app.use(productosRouterKoa.routes())
app.use(productosRouterKoa.allowedMethods())
app.listen(8081)