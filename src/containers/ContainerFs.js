import fs from "fs";
import logger from "../loggers/configLog4JS.js";
import { ContainerFactory } from "./ContainerFactory.js";

class ContainerFs extends ContainerFactory {
  constructor(file) {
    super();
    this.file = file;
  }

  async create(newItem) {
    try {
      const currentItems = await fs.promises.readFile(this.file, "utf-8");
      const items = JSON.parse(currentItems);
      const id = items.length !== 0 ? items[items.length - 1]?.id + 1 : 1;
      newItem.id = id;
      items.push(newItem);
      const newItems = JSON.stringify(items);
      await fs.promises.writeFile(this.file, newItems);
    } catch (e) {
      logger.error(`Api de mensajes: ${e}`);
    }
  }

  async read() {
    try {
      const currentItems = await fs.promises.readFile(this.file, "utf-8");
      const items = JSON.parse(currentItems);
      return items;
    } catch (e) {
      logger.error(`Api de mensajes: ${e}`);
    }
  }

  async readById(id) {
    try {
      id = parseInt(id);
      const currentItems = await fs.promises.readFile(this.file, "utf-8");
      const items = JSON.parse(currentItems);
      const item = items.find((item) => item.id === id);
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
      const currentItems = await fs.promises.readFile(this.file, "utf-8");
      const items = JSON.parse(currentItems);
      const item = items.find((item) => item.id === id);
      if (item) {
        newItem.id = id;
        const index = items.indexOf(items.find((item) => item.id === id));
        items.splice(index, 1, newItem);
        const newItems = JSON.stringify(items);
        await fs.promises.writeFile(this.file, newItems);
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
      const currentItems = await fs.promises.readFile(this.file, "utf-8");
      const items = JSON.parse(currentItems);
      const index = items.indexOf(items.find((item) => item.id === id));
      if (index > -1) {
        items.splice(index, 1);
        const newItems = JSON.stringify(items);
        await fs.promises.writeFile(this.file, newItems);
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
      const items = [];
      const newItems = JSON.stringify(items);
      await fs.promises.writeFile(this.file, newItems);
    } catch (e) {
      logger.error(`Api de mensajes: ${e}`);
    }
  }
}

export { ContainerFs };
