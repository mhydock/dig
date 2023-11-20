export class Listener<T extends (...args: any[]) => any> {
  private listeners: { [key: number]: T } = {};
  private listenerID = 0;

  add(func: T): number {
    this.listeners[this.listenerID] = func;
    const id = this.listenerID;
    this.listenerID++;
    return id;
  }

  remove(id: number) {
    delete this.listeners[id];
  }

  callAll(...args: Parameters<T>) {
    for (const i in this.listeners)
      if (this.listeners[i]) this.listeners[i](...args);
  }
}
