const printLogs = true;

export function log(message: any) {
  if (printLogs) console.log(message);
}

const Suffix = ["", "k", "m", "b", "t"];

export function withSuffix(value: number): string {
  if (value < 1000) return value.toString();

  let suff: number;
  for (suff = 0; value >= 1000; suff++) value /= 1000;

  let text: string;
  if (suff > 0) text = value.toFixed(2);
  else text = value.toString();

  return text + Suffix[suff];
}

export enum Orientation {
  NORTH = 1,
  EAST,
  SOUTH,
  WEST
}

export interface CostFunction {
  (baseCost: number, level: number): number;
}

export interface CostListenerFunc {
  (cost: number): void;
}
export interface LevelListenerFunc {
  (level: number): void;
}
export interface KnownListenerFunc {
  (known: boolean): void;
}
export interface AmountListenerFunc {
  (amount: number): void;
}
export interface VisibleListenerFunc {
  (visible: boolean): void;
}
