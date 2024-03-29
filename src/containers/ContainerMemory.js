import logger from "../loggers/configLog4JS.js";
import { ContainerFactory } from "./ContainerFactory.js";

class ContainerMemory extends ContainerFactory {
  constructor() {
    super();
    this.memoryArray = [];
  }

  async create(newItem) {
    try {
      const id =
        this.memoryArray.length !== 0
          ? this.memoryArray[this.memoryArray.length - 1]?.id + 1
          : 1;
      newItem.id = id;
      this.memoryArray.push(newItem);
    } catch (e) {
      logger.error(`Api de mensajes: ${e}`);
    }
  }

  async read() {
    try {
      return this.memoryArray;
    } catch (e) {
      logger.error(`Api de mensajes: ${e}`);
    }
  }

  async readById(id) {
    try {
      id = parseInt(id);
      const item = this.memoryArray.find((item) => item.id === id);
      if (item) {
        return item;
      }
    } catch (e) {
      logger.error(`Api de mensajes: ${e}`);
    }
  }

  async updateById(id, newItem) {
    try {
      id = parseInt(id);
      const item = this.memoryArray.find((item) => item.id === id);
      if (item) {
        newItem.id = id;
        const index = this.memoryArray.indexOf(
          this.memoryArray.find((item) => item.id === id)
        );
        this.memoryArray.splice(index, 1, newItem);
        return `Se ha actualizado el item ${id}`;
      } else {
        return `no se encuentra un item con el ID especificado`;
      }
    } catch (e) {
      logger.error(`Api de mensajes: ${e}`);
    }
  }

  async deleteById(id) {
    try {
      id = parseInt(id);
      const index = this.memoryArray.indexOf(
        this.memoryArray.find((item) => item.id === id)
      );
      if (index > -1) {
        this.memoryArray.splice(index, 1);
        return `se elimino el item con ID ${id}`;
      } else {
        return `no se encuentra un item con el ID especificado`;
      }
    } catch (e) {
      logger.error(`Api de mensajes: ${e}`);
    }
  }

  async deleteAll() {
    try {
      this.memoryArray = [];
    } catch (e) {
      logger.error(`Api de mensajes: ${e}`);
    }
  }
}

export { ContainerMemory };
