namespace Digdown.Core {
    export class Item {

        constructor(private name : string,
                    private desc : string,
                    private amount : number,
                    private value : number,
                    private known : boolean) {}
        
        
        amountListeners = new Listener<AmountListenerFunc>();
        knownListeners = new Listener<KnownListenerFunc>();
        
        get Name() : string {
            return this.name;
        }
        
        get Description() : string {
            return this.desc;
        }
        
        get Amount() : number {
            return this.amount;
        }
        
        get Value() : number {
            return this.value;
        }
        
        get TotalValue() : number {
            return this.amount * this.value;
        }
        
        get IsKnown() : boolean {
            return this.known;
        }
        
        add() {
            this.amount++;
            this.amountListeners.callAll(this.amount);
            
            if (!this.known)
            {
                this.known = true;
                this.knownListeners.callAll(true);
            }
        }
        
        addMany(amount : number) {
            this.amount += amount;
            this.amountListeners.callAll(this.amount);
            
            if (!this.known)
            {
                this.known = true;
                this.knownListeners.callAll(true);
            }
        }
        
        trySell() : number {
            if (this.amount <= 0)
                return -1;
                
            this.amount--;
            this.amountListeners.callAll(this.amount);
            return this.value;
        }
        
        trySellMany(amount : number) : number {
            if (this.amount <= 0)
                return -1;
                
            this.amount -= amount;
            this.amountListeners.callAll(this.amount);
            return this.value * amount;
        }
        
        trySellAll() : number {
            if (this.amount <= 0)
                return -1;
                
            let value = this.TotalValue;
            this.amount = 0;
            this.amountListeners.callAll(this.amount);
            return value;
        }
        
        addAmountListener(func : AmountListenerFunc) {
            return this.amountListeners.add(func);
        }
        
        addKnownListener(func : KnownListenerFunc) {
            return this.knownListeners.add(func);
        }
    }
}