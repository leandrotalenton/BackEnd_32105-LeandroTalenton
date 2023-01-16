import { io } from '../../index.js';
import { chatsDAO, productosDAO } from '../daos/index.js';

import util from 'util'
import { normalize, denormalize, schema } from 'normalizr';
const autoresSchema = new schema.Entity("autores");
const chatsSchema = new schema.Entity("chats", {mensajes:[{autor:autoresSchema}]});

export async function createSocketsChatsProductos() {
    return (
        io.on('connection', async (socket)=>{
            console.log(`Cliente conectado, id: ${socket.id}`)
        
            // chat <-- el deserializador seguramente se rompio con el cambio de DB, si tnego tiempo despues lo reviso
            socket.emit("new_msg", normalize({id: 'chats', mensajes: await chatsDAO.read() }, chatsSchema));
            socket.on("new_msg", async (data) => {
                try{
                    const currDate = new Date()
                    data.date= `${currDate.toLocaleString()}`
                    await chatsDAO.create(data)
                    const mensajesNormalizados = normalize({id: 'chats', mensajes: await chatsDAO.read() }, chatsSchema)
                    // console.log("mensajesNormalizados: ", util.inspect(mensajesNormalizados, false, 10, true ))
                    io.sockets.emit("new_msg", mensajesNormalizados);
                } catch(err) {
                    console.log(err)
                }
            });
        
            // prod
            socket.emit("new_prod", await productosDAO.read());
            socket.on("new_prod", async (data) => {
                try{
                    await productosDAO.create(data);
                    const productos = await productosDAO.read();
                    io.sockets.emit('new_prod', productos);
                } catch(err) {
                    console.log(err)
                }
            });
        })
    )
}