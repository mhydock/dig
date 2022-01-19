import { CostFunction } from "./Common";
import { TechDependency, Technology } from "./Technology";

interface Offset {
  x: number;
  y: number;
}

export type ToolOrientation = "horz" | "vert" | "any";

export class Tool {
  private static defaultCostFunc: CostFunction = (baseCost, amount) =>
    baseCost + Math.floor((amount * amount) / 4);

  private static saleMult = 0.75;

  constructor(
    private name: string,
    private desc: string,
    private amount: number,
    private power: number,
    private baseCost: number,
    private techDepends: TechDependency[],
    private workers: number,
    private canMove: boolean,
    private orientation: ToolOrientation = "any",
    private offset: Offset = { x: 0, y: 0 },
    private collisionMask: number[][] = [[0]],
    private costFunc: CostFunction = Tool.defaultCostFunc
  ) {}

  private getCostForAmount(amount: number): number {
    return this.costFunc(this.baseCost, amount);
  }

  tryBuy(money: number): number {
    if (this.IsResearched) return -1;

    const cost = this.BuyCost;
    if (money >= cost) {
      this.amount++;
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
      return sale;
    }
    return -1;
  }

  get Name(): string {
    return this.name;
  }

  get Description(): string {
    return this.desc;
  }

  get Amount(): number {
    return this.amount;
  }

  get Workers(): number {
    return this.workers;
  }

  get BuyCost(): number {
    return this.getCostForAmount(this.amount + 1);
  }

  get SaleCost(): number {
    return this.getCostForAmount(this.amount) * Tool.saleMult;
  }

  get Technologies(): Technology[] {
    return this.techDepends.map((td) => td.tech);
  }

  get TechDependencies(): TechDependency[] {
    return this.techDepends;
  }

  get TotalPower(): number {
    return this.amount * this.power;
  }

  get IsKnown(): boolean {
    return (
      !this.techDepends ||
      this.techDepends.every((td) => td.tech.IsVisible && td.tech.Level > 0)
    );
  }

  get IsResearched(): boolean {
    return (
      !this.techDepends ||
      this.techDepends.every((td) => td.tech.Level >= td.level)
    );
  }

  get CanMoveAndDig(): boolean {
    return this.canMove && this.amount > 0;
  }

  get Orientation() {
    return this.orientation;
  }

  get Offset() {
    return this.offset;
  }

  get CollisionMask() {
    return this.collisionMask;
  }
}
