/// <reference path='Block.ts'/>

namespace Digdown.Core {
    const WIDTH = 64;         // blocks/row
    const HEIGHT = 10240;     // rows

    export interface Point {
        x : number;
        y : number;
    }

    export class Grid {
        grid = new Array<Block>(WIDTH * HEIGHT);

		itemsFactory : ItemsFactory;
	    blockClearedListeners = new Listener<BlockClearedListenerFunc>();
    
        get width() : number { return WIDTH; }
        get height() : number { return HEIGHT; }        

		getRow(y : number) : Array<Block> {
            return this.grid.slice(y*WIDTH, (y+1)*WIDTH);
        }

        blockHpPerc(x: number, y: number) : number {
            let bl = this.block(x,y);
            if (bl != null)
                return bl.healthPercent();
            
            return -1;
        }

        block(x: number, y: number) : Block {
            if (x >= 0 && x < WIDTH &&
                y >= 0 && y < HEIGHT)
            {
                let i = y * WIDTH + x;
                if (this.grid[i] == null)
                    this.grid[i] = new Block(y, this.itemsFactory, this.blockClearedListeners);

                return this.grid[i];             
            }
                
            return null;
        }

        blocks(coords: Array<Point>) : Array<Block> {
            let bl : Block;
            let blocks = Array<Block>();
            for (let coord of coords) {
                if ((bl = this.block(coord.x, coord.y)) != null)
                    blocks.push(bl);
            }

            return blocks;
        }
        
        setItemsFactory(itemsFactory : ItemsFactory) {
		    this.itemsFactory = itemsFactory;
		};
		
		addBlockClearedListener(func : BlockClearedListenerFunc) {
		    return this.blockClearedListeners.add(func);
		};
    }
}
