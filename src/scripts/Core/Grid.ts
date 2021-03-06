import { Block, BlockClearedListenerFunc } from "./Block";
import { ItemsFactory } from "./ItemsFactory";
import { Listener } from "./Listener";

const WIDTH = 64; // blocks/row
const HEIGHT = 10240; // rows

export interface Point {
  x: number;
  y: number;
}

export class Grid {
  grid = new Array<Block>(WIDTH * HEIGHT);

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
    const bl = this.block(x, y);
    if (bl != null) return bl.HealthPercent;

    return -1;
  }

  isCleared(x: number, y: number): boolean {
    const bl = this.block(x, y);
    if (bl != null) return bl.IsCleared;

    return false;
  }

  getTooltipText(
    x: number,
    y: number
  ): { type: string; maxHP: number; currHP: number } | null {
    const health = this.healthPercent(x, y);
    if (health === 0) return null;

    const block = this.block(x, y);
    if (block === null) return null;

    return {
      type: block.TypePhrase,
      maxHP: block.Durability,
      currHP: Math.ceil(health * block.Durability)
    };
  }

  block(x: number, y: number): Block | null {
    if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
      const i = y * WIDTH + x;
      if (this.grid[i] == null)
        this.grid[i] = new Block(
          y,
          this.itemsFactory,
          this.blockClearedListeners
        );

      return this.grid[i];
    }

    return null;
  }

  blocks(coords: Array<Point>): Array<Block> {
    let bl: Block | null;
    const blocks = Array<Block>();
    for (const coord of coords) {
      if ((bl = this.block(coord.x, coord.y)) != null) blocks.push(bl);
    }

    return blocks;
  }

  addBlockClearedListener(func: BlockClearedListenerFunc) {
    return this.blockClearedListeners.add(func);
  }
}
