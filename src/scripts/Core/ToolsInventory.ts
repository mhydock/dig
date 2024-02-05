import toolTemplates from "../../assets/tools.json";
import { BlockCoordPair } from "./Block";
import { debug, Orientation } from "./Common";
import { Grid } from "./Grid";
import { TechnologyTree } from "./TechnologyTree";
import { Tool, ToolOrientation } from "./Tool";

export class ToolsInventory {
  public tools: Tool[] = [];
  public toolsMap: { [key: string]: Tool } = {};
  public activeTool: Tool;

  constructor(private techTree: TechnologyTree) {
    if (typeof techTree === "undefined" || techTree == null)
      throw "Tech Tree is undefined or null. Cannot create tools.";

    toolTemplates.forEach((tt) => {
      const tool = new Tool(
        tt.id,
        tt.name,
        tt.desc || "",
        tt.amount,
        tt.power,
        tt.baseCost,
        tt.techDepends.map((td) => ({
          tech: this.techTree.techMap[td.tech],
          level: td.level,
        })),
        tt.canMove,
        tt.orientation as ToolOrientation,
        tt.offset,
        tt.collisionMask
      );
      this.toolsMap[tt.id] = tool;
      this.tools.push(tool);
    });

    this.activeTool = this.tools[0];
  }

  get power(): number {
    return this.activeTool.totalPower;
  }

  get canMoveAndDig(): boolean {
    return !!this.activeTool.canMoveAndDig;
  }

  getAffected(
    grid: Grid,
    x: number,
    y: number,
    orient: Orientation
  ): BlockCoordPair[] {
    const coords = this.activeTool.getCollisionMask(orient).map((p) => ({
      x: x + p.x,
      y: y + p.y,
      weight: p.weight,
    }));
    return grid.blocks(coords);
  }

  digAffected(blocks: BlockCoordPair[]) {
    for (const b of blocks) {
      const damage = b.block.dig(this.power);
      debug(`Caused ${damage} damage to block [${b.point.x}, ${b.point.y}]`);
    }
  }
}
