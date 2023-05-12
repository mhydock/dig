const printLogs = true;

export function debug(message: any) {
  if (printLogs) console.log(message);
}

export function log2(value: number): number {
  return Math.log(value) / Math.log(2);
}

export function log10(value: number): number {
  return Math.log(value) / Math.log(10);
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

export function byId(id: string) {
  return document.getElementById(id);
}

export function getTrueOffsets(element: HTMLElement | null): {
  offsetLeft: number;
  offsetTop: number;
} {
  if (!element) return { offsetLeft: 0, offsetTop: 0 };
  const offsetLeft = element.offsetLeft;
  const offsetTop = element.offsetTop;
  const parentOffsets = getTrueOffsets(element.parentElement);
  return {
    offsetLeft: offsetLeft + parentOffsets.offsetLeft,
    offsetTop: offsetTop + parentOffsets.offsetTop,
  };
}

export enum Orientation {
  NORTH = 1,
  EAST,
  SOUTH,
  WEST,
}

export interface CostFunction {
  (baseCost: number, level: number): number;
}
