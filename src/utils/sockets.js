import util from 'util'

import { io } from '../app.js';
import { DaoFactory } from '../daos/FactoryDao.js';
import logger from '../loggers/configLog4JS.js';

const chatsDAO = DaoFactory.getChatsDao()
const productosDAO = DaoFactory.getProductosDao()

export async function createSocketsChatsProductos() {
    return (
        io.on('connection', async (socket)=>{
            logger.info(`Cliente conectado, id: ${socket.id}`)

            // // chat 
            socket.emit("new_msg", await chatsDAO.read());
            socket.on("new_msg", async (data) => {
                try{
                    const currDate = new Date()
                    data.date= `${currDate.toLocaleString()}`
                    await chatsDAO.create(data)
                    io.sockets.emit("new_msg", await chatsDAO.read());
                } catch(e) {
                    logger.error(e)
                }
            });
        
            // prod
            socket.emit("new_prod", await productosDAO.read());
            socket.on("new_prod", async (data) => {
                try{
                    await productosDAO.create(data);
                    const productos = await productosDAO.read();
                    io.sockets.emit('new_prod', productos);
                } catch(e) {
                    logger.error(e)
                }
            });
        })
    )
}