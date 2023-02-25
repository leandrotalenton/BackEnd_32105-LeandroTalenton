import { DaoFactory } from "../daos/daoFactory.js"

const usuariosDAO = DaoFactory.getUsuariosDao()


export async function readByUsernameAndPassword(username, password) {
    try {
        const users = await usuariosDAO.read()
        const user = users.find(user => user.username === username && user.password === password)
        if (user) {
            return user
        }
    } catch (e) {
        console.log(e)
    }
}
// console.log(await readByUsernameAndPassword('juancarlos', '$2b$10$4Pru1kRleW4SXWpclgI71.wRp7EYGYdbgpD5AvUajWoncTHvOYii.'))

export async function readByUsername(username) {
    try {
        const users = await usuariosDAO.read()
        const user = users.find(user => user.username === username)
        if (user) {
            return user
        }
    } catch (e) {
        console.log(e)
    }
}

export async function updatePictureByUsername(username, path) {
    try {
        const users = await usuariosDAO.read()
        const user = users.find(user => user.username === username)
        user.pic = path
        await usuariosDAO.updateById(user._id, user)
    } catch (e) {
        console.log(e)
    }
}
