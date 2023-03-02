const socket = io.connect();

// chat ///////////////////////////////////////////////////////////////////

function renderChat(data) {
    const chatProfile = document.querySelector("[data-chatprofile]").getAttribute("data-chatprofile")
    const chatOwnerUsername = document.querySelector("[data-autor-username]")?.getAttribute("data-autor-username")
    const chatSubjectUsername = document.querySelector("[data-destinatario]")?.getAttribute("data-destinatario")

    const chatHTML = data.map((msg) => {
        let ownOrThird
        chatOwnerUsername === msg.autor.username ? ownOrThird = "--own" : ownOrThird = "--third"

        let recipientAllOrParticular
        msg.destinatario === "Everyone" ? recipientAllOrParticular = "--all" : recipientAllOrParticular = "--particular"

        if(!(msg.destinatario === "Everyone" || msg.destinatario === chatOwnerUsername || msg.autor.username === chatOwnerUsername )) return ''
        if((chatProfile === "individual") && (
            //              SENDER                                      RECEIVER
            (msg.autor.username !== chatOwnerUsername && msg.destinatario !== chatOwnerUsername) || 
            (msg.autor.username === chatSubjectUsername && msg.destinatario !== chatOwnerUsername) ||
            (msg.autor.username === chatOwnerUsername && msg.destinatario !== chatSubjectUsername) ||
            //              SENDER                                       SENDER
            (msg.autor.username !== chatOwnerUsername && msg.autor.username !== chatSubjectUsername)
            )) return ''

        return `
            <li class="messageContainer ${ownOrThird}">
                <a href="/chat/${msg.autor.username}">
                    <img class="senderImg" src="${msg.autor.pic}">
                </a>
                <div class="message">
                    <a class="sender" href="/chat/${msg.autor.username}">
                        <span class="name">${msg.autor.username}</span>
                        <p class="time">${msg.date}</p>
                    </a>
                    <div class="content">
                        <div class="recipient ${recipientAllOrParticular}">
                            To ${msg.destinatario}
                        </div>
                        <div class="text">
                            ${msg.msj}
                        </div>
                    </div>
                </div>
            </li>
        `
    }).join(" ");

    const chatWindow = document.querySelector(`.chatWindow`)
    chatWindow.innerHTML = chatHTML;
    chatWindow.scrollTop = chatWindow.scrollHeight;

    const dataDestinatario = document.querySelector("[data-destinatario]")?.getAttribute("data-destinatario")
    dataDestinatario && (document.querySelector("#chat_destinatario").value = dataDestinatario)
}

function enviarMensaje() {
    const msj = document.getElementById("chat_mensaje").value
    const data = {
        autor: {
            username: document.querySelector("[data-autor-username]").getAttribute("data-autor-username"),
            pic: document.querySelector("[data-autor-pic]").getAttribute("data-autor-pic")
        },
        destinatario: document.getElementById("chat_destinatario").value || "Everyone",
        msj
    }
    msj && socket.emit("new_msg", data);
    document.getElementById("chat_mensaje").value = "";
    return false;
}

socket.on("new_msg", (data) => {
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

    const productosContainer = document.querySelector(`#productos--tbody`)
    productosContainer && (productosContainer.innerHTML = productosHTML || "No hay productos que coincidan con la categoria seleccionada");
    const productButtons = document.querySelectorAll(".prodBtn")
    productButtons.forEach(button=>{
        button.addEventListener('click', async (e)=>{
            try{
                const productId = e.currentTarget.getAttribute("data-id")
                const cantidad = document.querySelector(`#q-${productId}`).value
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