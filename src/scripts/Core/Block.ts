import { ItemPrize } from "./ItemChance";
import { ItemsFactory } from "./ItemsFactory";
import { Listener } from "./Listener";

function log2(value: number): number {
  return Math.log(value) / Math.log(2);
}

function log10(value: number): number {
  return Math.log(value) / Math.log(10);
}

export interface BlockClearedListenerFunc {
  (items: ItemPrize): void;
}

const BASE_DIGS_PER_UNIT_POWER = 2.0;
const BASE_BLOCK_DURABILITY = 255;
const BASE_POWER_MULTIPLIER = BASE_BLOCK_DURABILITY / BASE_DIGS_PER_UNIT_POWER;
const BLOCK_TYPE_PHRASE = [
  "Dirt",
  "Clay",
  "Gravel",
  "Limestone",
  "Sandstone",
  "Marble",
  "Granite",
  "Bedrock"
];

export enum BlockType {
  SDIRT = 1,
  MDIRT,
  HDIRT,
  BDROCK
}

export class Block {
  private type: number;
  private health: number;
  private durability: number;

  constructor(
    private depth: number,
    private itemsFactory: ItemsFactory,
    private blockClearedListener: Listener<BlockClearedListenerFunc>
  ) {
    this.health = BASE_BLOCK_DURABILITY;
    this.durability =
      Math.ceil((depth * depth + 1) / 100) * BASE_DIGS_PER_UNIT_POWER;
    this.type = Math.ceil(Math.log(this.durability / Math.LN10));
  }

  dig(power: number, x: number, y: number): number {
    const damage: number = Math.ceil(
      (power * BASE_POWER_MULTIPLIER) / this.durability
    );
    const remainingHP: number = this.health;
    this.health -= Math.min(remainingHP, damage);

    console.log("Caused " + damage + " damage to block [" + x + "," + y + "]");
    if (this.health == 0) {
      console.log("Block obliterated");
      this.itemsFactory.produceItems(this.Type);
    }

    return damage;
  }

  get Type(): number {
    return this.type;
  }

  get TypePhrase(): string {
    return BLOCK_TYPE_PHRASE[this.type];
  }

  get Depth(): number {
    return this.depth;
  }

  get Health(): number {
    return this.health;
  }

  get IsCleared(): boolean {
    return this.health == 0;
  }

  get HealthPercent(): number {
    return this.health / BASE_BLOCK_DURABILITY;
  }

  get Durability(): number {
    return this.durability;
  }
}
