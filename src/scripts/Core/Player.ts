import { debug, Orientation } from "./Common";
import { Grid } from "./Grid";
import { ToolsInventory } from "./ToolsInventory";

export class Player {
  constructor(
    private x: number,
    private y: number,
    private grid: Grid,
    private tools: ToolsInventory,
  ) {}

  orient = Orientation.NORTH;

  step(x: number, y: number): void {
    if (x < 0 || x >= this.grid.Width || y < -1 || y >= this.grid.Height)
      return;

    debug("Attempting to move to [" + x + "," + y + "]");

    let affected = [];
    // if player is above ground, just let them move.
    if (this.y == -1 && y == this.y) {
      debug("Player is above ground");
      this.x = x;
      affected = this.tools.getAffected(this.grid, this.x, this.y, this.orient);
    } else if (this.grid.isCleared(x, y)) {
      debug("Path is clear");
      this.y = y;
      this.x = x;
      affected = this.tools.getAffected(this.grid, this.x, this.y, this.orient);
    } else {
      affected = this.tools.getAffected(this.grid, this.x, this.y, this.orient);
      debug("Path is not clear");
      if (this.tools.canMoveAndDig) {
        this.tools.digAffected(affected);
        if (this.grid.isCleared(x, y)) {
          this.y = y;
          this.x = x;
        }
        affected = this.tools.getAffected(
          this.grid,
          this.x,
          this.y,
          this.orient,
        );
      }
    }

    this.grid.affected = affected;
  }

  moveUp(): void {
    this.orient = Orientation.NORTH;
    this.step(this.x, this.y - 1);
  }

  moveDown(): void {
    this.orient = Orientation.SOUTH;
    this.step(this.x, this.y + 1);
  }

  moveLeft(): void {
    this.orient = Orientation.WEST;
    this.step(this.x - 1, this.y);
  }

  moveRight(): void {
    this.orient = Orientation.EAST;
    this.step(this.x + 1, this.y);
  }

  faceUp(): void {
    this.orient = Orientation.NORTH;
    this.grid.affected = this.tools.getAffected(
      this.grid,
      this.x,
      this.y,
      this.orient,
    );
  }

  faceDown(): void {
    this.orient = Orientation.SOUTH;
    this.grid.affected = this.tools.getAffected(
      this.grid,
      this.x,
      this.y,
      this.orient,
    );
  }

  faceLeft(): void {
    this.orient = Orientation.WEST;
    this.grid.affected = this.tools.getAffected(
      this.grid,
      this.x,
      this.y,
      this.orient,
    );
  }

  faceRight(): void {
    this.orient = Orientation.EAST;
    this.grid.affected = this.tools.getAffected(
      this.grid,
      this.x,
      this.y,
      this.orient,
    );
  }

  dig(): void {
    let affected = this.tools.getAffected(
      this.grid,
      this.x,
      this.y,
      this.orient,
    );
    this.tools.digAffected(affected);
    affected = affected.filter((p) => !p.block.IsCleared);
    this.grid.affected = affected;
  }

  get X(): number {
    return this.x;
  }

  get Y(): number {
    return this.y;
  }

  get Orientation(): number {
    return this.orient;
  }

  get PlayerPower(): number {
    return this.tools.power;
  }
}
