import {
  Coefficients,
  createGrowthFunction,
  FuncType,
  GrowthFunction,
  Orientation,
  Point,
} from "./Common";
import { TechDependency, Technology } from "./Technology";

interface Offset {
  x: number;
  y: number;
}

export type ToolOrientation = "horz" | "vert" | "any";

export class Tool {
  private static saleMult = 0.75;
  public costFunc: GrowthFunction;
  public powerFunc: GrowthFunction;
  public orientedColMasks: { [key in Orientation]: Point[] } = {
    [Orientation.EAST]: [],
    [Orientation.WEST]: [],
    [Orientation.NORTH]: [],
    [Orientation.SOUTH]: [],
  };

  constructor(
    public id: string,
    public name: string,
    public desc: string,
    public amount: number,
    public baseCost: number,
    public basePower: number,
    public techDepends: TechDependency[],
    public canMove: boolean,
    public orientation: ToolOrientation = "any",
    public offset: Offset = { x: 0, y: 0 },
    public collisionMask: number[][] = [],
    public costFunctionType: FuncType = FuncType.LINEAR,
    public costCoefficients: Coefficients = {},
    public powerFunctionType: FuncType = FuncType.LINEAR,
    public powerCoefficients: Coefficients = {},
  ) {
    this.costFunc = createGrowthFunction(costFunctionType, costCoefficients);
    this.powerFunc = createGrowthFunction(powerFunctionType, powerCoefficients);

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

  getCostForAmount(amount: number): number {
    return this.costFunc(this.baseCost, amount);
  }

  tryBuy(money: number): number {
    if (!this.isResearched) return -1;

    const cost = this.buyCost;
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
      const sale = this.saleCost;
      this.amount--;
      return sale;
    }
    return -1;
  }

  get buyCost(): number {
    return this.getCostForAmount(this.amount + 1);
  }

  get saleCost(): number {
    return this.getCostForAmount(this.amount) * Tool.saleMult;
  }

  get technologies(): Technology[] {
    return this.techDepends.map((td) => td.tech);
  }

  get totalPower(): number {
    return this.powerFunc(this.basePower, this.amount);
  }

  get isKnown(): boolean {
    return (
      !this.techDepends ||
      this.techDepends.every((td) => td.tech.isVisible && td.tech.level > 0)
    );
  }

  get isResearched(): boolean {
    return (
      !this.techDepends ||
      this.techDepends.every((td) => td.tech.level >= td.level)
    );
  }

  get canMoveAndDig(): boolean {
    return this.canMove && this.amount > 0;
  }

  public getCollisionMask(orient: Orientation) {
    return this.orientedColMasks[orient];
  }
}
