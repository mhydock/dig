import { AmountListenerFunc, CostFunction, CostListenerFunc } from "./Common";
import { Listener } from "./Listener";
import { Technology } from "./Technology";

export class Tool {
  private static defaultCostFunc: CostFunction = (baseCost, amount) =>
    baseCost + Math.floor((amount * amount) / 4);
  private minLevel: number;

  private buyCost = 0;
  private saleCost = 0;

  private amountListeners = new Listener<AmountListenerFunc>();
  private costListeners = new Listener<CostListenerFunc>();

  saleMult = 0.75;

  constructor(
    private name: string,
    private amount: number,
    private power: number,
    private baseCost: number,
    private technology: Technology,
    private workers: number,
    private level: number,
    private costFunc: CostFunction = Tool.defaultCostFunc
  ) {
    this.minLevel = this.level;

    if (amount > 0) this.updateCosts(amount);
    else this.buyCost = baseCost;
  }

  private getCostForAmount(amount: number): number {
    return this.costFunc(this.baseCost, amount);
  }

  private getBuyCost(amount: number): number {
    return this.getCostForAmount(amount + 1);
  }

  private getSaleCost(amount: number): number {
    return this.getCostForAmount(amount) * this.saleMult;
  }

  private updateCosts(amount: number) {
    this.buyCost = this.getBuyCost(amount);
    this.saleCost = this.getSaleCost(amount);
  }

  tryBuy(money: number): number {
    if (this.minLevel < this.technology.Level) return -1;

    const cost = this.BuyCost;
    if (money >= cost) {
      this.amount++;

      this.buyCost = this.getBuyCost(this.amount);
      this.saleCost = this.getSaleCost(this.amount);
      this.costListeners.callAll(this.buyCost);
      this.amountListeners.callAll(this.amount);

      return cost;
    }
    return -1;
  }

  trySell(): number {
    //if (_minLevel < _technology.getLevel())
    //return -1;

    if (this.amount > 0) {
      const sale = this.SaleCost;
      this.amount--;

      this.buyCost = this.getBuyCost(this.amount);
      this.saleCost = this.getSaleCost(this.amount);
      this.costListeners.callAll(this.buyCost);
      this.amountListeners.callAll(this.amount);

      return sale;
    }
    return -1;
  }

  addCostListener(func: CostListenerFunc) {
    this.costListeners.add(func);
  }

  addAmountListener(func: AmountListenerFunc) {
    this.amountListeners.add(func);
  }

  get Name(): string {
    return this.name;
  }

  get Level(): number {
    return this.level;
  }

  get Amount(): number {
    return this.amount;
  }

  get Workers(): number {
    return this.workers;
  }

  get BuyCost(): number {
    return this.buyCost;
  }

  get SaleCost(): number {
    return this.saleCost;
  }

  get Technology(): Technology {
    return this.technology;
  }

  get MinTechLevel(): number {
    return this.minLevel;
  }

  get TotalPower(): number {
    return this.amount * this.power;
  }

  get IsKnown(): boolean {
    return this.technology.IsVisible && this.technology.Level > 0;
  }
}
