import { DaoFactory } from "../daos/FactoryDao.js";
import logger from "../loggers/configLog4JS.js";

const usuariosDAO = DaoFactory.getUsuariosDao();

export async function readByUsernameAndPassword(username, password) {
  try {
    const users = await usuariosDAO.read();
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      return user;
    }
  } catch (e) {
    logger.error(e);
  }
}

export async function readByUsername(username) {
  try {
    const users = await usuariosDAO.read();
    const user = users.find((user) => user.username === username);
    if (user) {
      return user;
    }
  } catch (e) {
    logger.error(e);
  }
}

export async function updatePictureByUsername(username, path) {
  try {
    const users = await usuariosDAO.read();
    const user = users.find((user) => user.username === username);
    user.pic = path;
    await usuariosDAO.updateById(user._id, user);
  } catch (e) {
    logger.error(e);
  }
}
