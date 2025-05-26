const printLogs = true;

export function debug(...message: any[]) {
  if (printLogs) console.log(...message);
}

export function log2(value: number): number {
  return Math.log(value) / Math.log(2);
}

export function log10(value: number): number {
  return Math.log(value) / Math.log(10);
}

const SUFFIXES = [
  "",
  "K",
  "M",
  "B",
  "T",
  "q",
  "Q",
  "s",
  "S",
  "O",
  "N",
  "D",
  "uD",
  "dD",
  "tD",
  "qD",
  "QD",
  "sD",
  "SD",
  "oD",
  "nD",
  "V",
];

export function withSuffix(value: number): string {
  if (value < 1000) return value.toString();

  let suff: number;
  for (suff = 0; value >= 1000 && suff < SUFFIXES.length - 1; suff++)
    value /= 1000;

  let text: string;
  if (suff > 0) text = value.toFixed(2);
  else text = value.toString();

  return text + SUFFIXES[suff];
}

export function byId(id: string) {
  return document.getElementById(id);
}

export enum Orientation {
  NORTH = 1,
  EAST,
  SOUTH,
  WEST,
}

export interface Point {
  x: number;
  y: number;
  weight?: number;
}

export interface GrowthFunction {
  (baseValue: number, level: number): number;
}

export enum FuncType {
  LINEAR,
  QUADRATIC,
  CUBIC,
  ASYMPTOTIC,
  EXPONENTIAL,
}

export type Coefficients = {
  a?: number;
  b?: number;
  c?: number;
};

export function createGrowthFunction(
  funcType: FuncType,
  coefficients: Coefficients = {},
) {
  const {
    a = 1,
    b = funcType == FuncType.ASYMPTOTIC ? Math.E : 1,
    c = 1,
  } = coefficients;

  switch (funcType) {
    case FuncType.LINEAR:
      return (base: number, x: number) => a * x + base;
    case FuncType.QUADRATIC:
      return (base: number, x: number) => a * x ** 2 + b * x + base;
    case FuncType.CUBIC:
      return (base: number, x: number) =>
        a * x ** 3 + b * x ** 2 + c * x + base;
    case FuncType.ASYMPTOTIC:
      return (base: number, x: number) =>
        (a * Math.log(x)) / Math.log(b) + base;
    case FuncType.EXPONENTIAL:
      return (base: number, x: number) => a * Math.E ** (b * x) + base;
  }
}
