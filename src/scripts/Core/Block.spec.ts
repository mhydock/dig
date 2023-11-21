import { Block, BlockType, BlockClearedListenerFunc } from './Block';
import { ItemsFactory } from './ItemsFactory';
import { ItemsInventory } from './ItemsInventory';
import { Listener } from './Listener';

describe('Block module', () => {
  test('Block Type should be small dirt', () => {
    const listener = new Listener<BlockClearedListenerFunc>();
    const inventory = new ItemsInventory();
    const factory = new ItemsFactory(inventory);
    const block = new Block(0, factory, listener);
    console.log(block.Type);
    expect(block.Type).toBe(BlockType.SDIRT);
  });
});