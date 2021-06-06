import { Storage as IonicStorage } from "@ionic/storage";

class Storage {
  private storage = new IonicStorage({
    name: "__ryobi-gdo",
  });
  private store: IonicStorage | null = null;

  constructor() {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this.store = storage;
  }

  getStore() {
    return this.store!;
  }

  getStoreLazy() {
    return this.store;
  }
}

export default new Storage();
