import { GrowthFunction } from "./Common";

export interface TechDependency {
  tech: Technology;
  level: number;
}

export class Technology {
  private static defaultCostFunc: GrowthFunction = (baseCost, level) =>
    baseCost * Math.pow(level + 1, 2);

  private level = 0;
  private maxLevel = 10;
  private currCost: number;

  constructor(
    private name: string,
    private baseCost: number,
    private techDepends: TechDependency[] | null = null,
    private costFunc: GrowthFunction = Technology.defaultCostFunc
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

  get Name(): string {
    return this.name;
  }

  get Level(): number {
    return this.level;
  }

  get MaxLevel(): number {
    return this.maxLevel;
  }

  get ResearchCost(): number {
    return this.currCost;
  }

  get IsVisible(): boolean {
    return (
      !this.techDepends ||
      this.techDepends.every((td) => td.tech.Level >= td.level)
    );
  }
}
