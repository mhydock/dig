import { Grid } from "../Core/Grid";
import { Player } from "../Core/Player";

export interface GameGrid {
  TileSize: number;
  ViewRows: number;
  YOffset: number;

  GameGrid: Grid;
  Player: Player;
  Screen: HTMLDivElement;

  drawScreen(): void;

  normalizeXY(x: number, y: number): { row: number; col: number };
  getHoverText(x: number, y: number): HoverText | null;
}

export interface HoverText {
  power?: number;
  type?: string;
  maxHP?: number;
  currHP?: number;
}
