import { GrowthFunction } from "./Common";

export interface TechDependency {
  tech: Technology;
  level: number;
}

export class Technology {
  private static defaultCostFunc: GrowthFunction = (baseCost, level) =>
    baseCost * Math.pow(level + 1, 2);

  public level = 0;
  public maxLevel = 10;
  public currCost: number;

  constructor(
    public id: string,
    public name: string,
    public baseCost: number,
    public techDepends: TechDependency[] | null = null,
    public costFunc: GrowthFunction = Technology.defaultCostFunc,
  ) {
    this.currCost = baseCost;
  }

  tryResearch(money: number): number {
    if (money >= this.currCost) {
      const cost = this.currCost;

      this.level++;

      this.currCost = this.costFunc(this.baseCost, this.level + 1);

      return cost;
    }
    return -1;
  }

  get researchCost(): number {
    return this.currCost;
  }

  get isVisible(): boolean {
    return (
      !this.techDepends ||
      this.techDepends.every((td) => td.tech.level >= td.level)
    );
  }
}
