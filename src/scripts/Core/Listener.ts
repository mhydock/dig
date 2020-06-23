namespace Core {

    export class Listener<T extends Function> {
        
        private listeners : { [key: number] : T } = {};
        private listenerID = 0;
        
        add(func : T) : number {
            this.listeners[this.listenerID] = func;
            let id = this.listenerID;
            this.listenerID++;
            return id;
        }
        
        remove(id : number) {
            delete this.listeners[id];
        }
        
        callAll(...args : any[]) {
            for(let i in this.listeners)
                if (this.listeners.hasOwnProperty(i))
                    this.listeners[i].apply(this, args); 
        }
    }
}