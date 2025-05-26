import { Block, BlockClearedListenerFunc, BlockCoordPair } from "./Block";
import { Point } from "./Common";
import { ItemsFactory } from "./ItemsFactory";
import { Listener } from "./Listener";

const WIDTH = 64; // blocks/row
const HEIGHT = 10240; // rows

export class Grid {
  grid = new Array<Block>(WIDTH * HEIGHT);
  affected: BlockCoordPair[] = [];

  constructor(private itemsFactory: ItemsFactory) {}

  blockClearedListeners = new Listener<BlockClearedListenerFunc>();

  get Width(): number {
    return WIDTH;
  }
  get Height(): number {
    return HEIGHT;
  }

  getRow(y: number): Array<Block> {
    return this.grid.slice(y * WIDTH, (y + 1) * WIDTH);
  }

  healthPercent(x: number, y: number): number {
    const bl = this.blockAt(x, y);
    if (bl != null) return bl.HealthPercent;

    return -1;
  }

  isCleared(x: number, y: number): boolean {
    const bl = this.blockAt(x, y);
    if (bl != null) return bl.IsCleared;

    return false;
  }

  getTooltipText(
    x: number,
    y: number,
  ): { type: string; maxHP: number; currHP: number } | null {
    const health = this.healthPercent(x, y);
    if (health === 0) return null;

    const block = this.blockAt(x, y);
    if (block === null) return null;

    return {
      type: block.TypePhrase,
      maxHP: block.Durability,
      currHP: Math.ceil(health * block.Durability),
    };
  }

  blockAt(x: number, y: number): Block | null {
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
      const i = y * WIDTH + x;
      if (this.grid[i] == null)
        this.grid[i] = new Block(
          y,
          this.itemsFactory,
          this.blockClearedListeners,
        );

      return this.grid[i];
    }

    return null;
  }

  blocks(coords: Array<Point>): BlockCoordPair[] {
    return coords
      .map((c) => ({
        block: this.blockAt(c.x, c.y),
        point: c,
      }))
      .filter((b) => b.block && !b.block.IsCleared) as BlockCoordPair[];
  }

  addBlockClearedListener(func: BlockClearedListenerFunc) {
    return this.blockClearedListeners.add(func);
  }
}
