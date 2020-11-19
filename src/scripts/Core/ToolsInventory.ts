import * as toolTemplates from "../../assets/tools.json";
import { Orientation } from "./Common";
import { Grid } from "./Grid";
import { TechnologyTree } from "./TechnologyTree";
import { Tool, ToolOrientation } from "./Tool";

export class ToolsInventory {
  private tools: Tool[] = [];
  private toolsMap: { [key: string]: Tool } = {};

  constructor(private techTree: TechnologyTree) {
    if (typeof techTree === "undefined" || techTree == null)
      throw "Tech Tree is undefined or null. Cannot create tools.";

    toolTemplates.forEach(tt => {
      const tool = new Tool(
        tt.name,
        tt.desc || "",
        tt.amount,
        tt.power,
        tt.baseCost,
        this.techTree.TechMap[tt.technology],
        tt.workers,
        tt.level,
        tt.canMove,
        tt.orientation as ToolOrientation,
        tt.offset
      );
      this.toolsMap[tt.id] = tool;
      this.tools.push(tool);
    });
  }

  get Tools() {
    return this.tools;
  }

  get ToolsMap() {
    return this.toolsMap;
  }

  get Power(): number {
    let total = 0;
    for (const i in this.tools) {
      if (this.tools[i]) total += this.tools[i].TotalPower;
    }
    return total;
  }

  canMoveAndStep(): boolean {
    return this.tools.filter(t => t.CanMoveAndDig).length > 0;
  }

  dig(grid: Grid, x: number, y: number, orient: Orientation): number {
    return 0;
  }
}
