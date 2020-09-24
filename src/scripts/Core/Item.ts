export class Item {
  constructor(
    private name: string,
    private desc: string,
    private amount: number,
    private value: number,
    private known: boolean
  ) {}

  get Name(): string {
    return this.name;
  }

  get Description(): string {
    return this.desc;
  }

  get Amount(): number {
    return this.amount;
  }

  get Value(): number {
    return this.value;
  }

  get TotalValue(): number {
    return this.amount * this.value;
  }

  get IsKnown(): boolean {
    return this.known;
  }

  add() {
    this.amount++;

    if (!this.known) {
      this.known = true;
    }
  }

  addMany(amount: number) {
    this.amount += amount;

    if (!this.known) {
      this.known = true;
    }
  }

  trySell(): number {
    if (this.amount <= 0) return -1;

    this.amount--;
    return this.value;
  }

  trySellMany(amount: number): number {
    if (this.amount <= 0) return -1;

    this.amount -= amount;
    return this.value * amount;
  }

  trySellAll(): number {
    if (this.amount <= 0) return -1;

    const value = this.TotalValue;
    this.amount = 0;
    return value;
  }
}
