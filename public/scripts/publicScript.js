const socket = io.connect();


// chat ///////////////////////////////////////////////////////////////////

// desnormalizacion de data:
const autoresSchema = new normalizr.schema.Entity("autores");
const chatsSchema = new normalizr.schema.Entity("chats", {mensajes:[{autor:autoresSchema}]});

function renderChat(data) {
    const chatHTML = data.map((msg) => {
        return `
            <li>
                <div>
                    <span>${msg._doc.autor.alias} on [${msg._doc.date}]: ${msg._doc.msj}</span>
                </div>
            </li>
        `
    }).join(" ");

    document.querySelector(`.chatContainer>ul`).innerHTML = chatHTML;
}

function enviarMensaje() {
    const data = {
        autor: {
            id: document.getElementById("email").value,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            edad: document.getElementById("edad").value,
            alias: document.getElementById("alias").value,
            avatar: document.getElementById("avatar").value,
        },
        msj: document.getElementById("chat_mensaje").value 
    }
    socket.emit("new_msg", data);
    document.getElementById("chat_mensaje").value = "";
    return false;
}

socket.on("new_msg", (dataNormalizada) => {
    //denormalizacion de la data
    // console.log("esto recibe el front: ",dataNormalizada)
    const data = normalizr.denormalize(dataNormalizada.result, chatsSchema, dataNormalizada.entities).mensajes
    // console.log("esto intenta renderizar el front", normalizr.denormalize(dataNormalizada.result, chatsSchema, dataNormalizada.entities))
    console.log("porcentaje de reduccion de datos: ", (JSON.stringify(dataNormalizada).length/JSON.stringify(normalizr.denormalize(dataNormalizada.result, chatsSchema, dataNormalizada.entities)).length)*100,"%")
    renderChat(data);
})

// productos ////////////////////////////////////////////////////////////////


function renderProductos(data) {
    const productosHTML = data.map((producto) => {
        return `
            <tr>
                <td>
                    <a href="/productos/${producto._id}">
                        ${producto.title}
                    </a>
                </td>
                <td>
                    <a href="/productos?category=${producto.category}">
                        ${producto.category}
                    </a>
                </td>
                <td>${producto.price}</td>
                <td>
                    <img src=${producto.thumbnail}>
                </td>
                <td>
                    <input id="q-${producto._id}" type="number" value="1" />
                </td>
                <td>
                    <button class="prodBtn" data-id="${producto._id}">+</button>
                </td>
            </tr>
        `
    }
    ).join(" ");

    document.querySelector(`#productos--tbody`).innerHTML = productosHTML || "No hay productos que coincidan con la categoria seleccionada";
    const productButtons = document.querySelectorAll(".prodBtn")
    productButtons.forEach(button=>{
        button.addEventListener('click', async (e)=>{
            try{
                const productId = e.currentTarget.getAttribute("data-id")
                console.log(`q-${productId}`)
                const cantidad = document.querySelector(`#q-${productId}`).value
                console.log(cantidad)
                await fetch(`/carrito/${productId}/productos?cantidad=${cantidad}`, {method: "POST"})
            } catch (e) {
                console.log(e)
            }
        })
    })
}

socket.on("new_prod", (data) => {
    renderProductos(data);
})