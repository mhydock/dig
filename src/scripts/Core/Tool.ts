import { debug, GrowthFunction, Orientation, Point } from "./Common";
import { TechDependency, Technology } from "./Technology";

interface Offset {
  x: number;
  y: number;
}

export type ToolOrientation = "horz" | "vert" | "any";

export class Tool {
  private static defaultCostFunc: GrowthFunction = (baseCost, amount) =>
    baseCost + Math.floor((amount * amount) / 4);
  private static defaultPowerFunc: GrowthFunction = (basePower, amount) =>
    Math.floor(basePower * amount);

  private static saleMult = 0.75;
  private orientedColMasks: { [key in Orientation]: Point[] } = {
    [Orientation.EAST]: [],
    [Orientation.WEST]: [],
    [Orientation.NORTH]: [],
    [Orientation.SOUTH]: [],
  };

  constructor(
    private name: string,
    private desc: string,
    private amount: number,
    private baseCost: number,
    private basePower: number,
    private techDepends: TechDependency[],
    private canMove: boolean,
    private orientation: ToolOrientation = "any",
    private offset: Offset = { x: 0, y: 0 },
    private collisionMask: number[][] = [],
    private costFunc: GrowthFunction = Tool.defaultCostFunc,
    private powerFunc: GrowthFunction = Tool.defaultPowerFunc
  ) {
    const h = Math.floor(collisionMask.length / 2);
    for (let row = 0; row < collisionMask.length; row++) {
      for (let col = 0; col < collisionMask[row].length; col++) {
        if (collisionMask[row][col] > 0) {
          const l = -offset.x - col;
          const r = offset.x + col;
          const t = h - offset.y + row;
          const b = h + offset.y - row;
          const m = collisionMask[row][col];
          this.orientedColMasks[Orientation.EAST].push({
            x: r,
            y: t,
            weight: m,
          });
          this.orientedColMasks[Orientation.WEST].push({
            x: l,
            y: t,
            weight: m,
          });
          this.orientedColMasks[Orientation.NORTH].push({
            x: t,
            y: l,
            weight: m,
          });
          this.orientedColMasks[Orientation.SOUTH].push({
            x: b,
            y: r,
            weight: m,
          });
        }
      }
    }
  }

  private getCostForAmount(amount: number): number {
    return this.costFunc(this.baseCost, amount);
  }

  tryBuy(money: number): number {
    if (!this.IsResearched) return -1;

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
    return this.powerFunc(this.basePower, this.amount);
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

  public getCollisionMask(orient: Orientation) {
    return this.orientedColMasks[orient];
  }
}
