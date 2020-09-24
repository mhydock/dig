import { CostFunction } from "./Common";

export class Technology {
  private static defaultCostFunc: CostFunction = (baseCost, level) =>
    baseCost * Math.pow(level + 1, 2);

  private level = 0;
  private maxLevel = 10;
  private currCost: number;

  constructor(
    private name: string,
    private baseCost: number,
    private dependTech: Technology | null = null,
    private dependLevel: number = 0,
    private costFunc: CostFunction = Technology.defaultCostFunc
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
      !this.dependTech ||
      (this.dependTech.IsVisible && this.level >= this.dependLevel)
    );
  }
}
