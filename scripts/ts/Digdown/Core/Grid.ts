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
    
        get Width() : number { return WIDTH; }
        get Height() : number { return HEIGHT; }        

		getRow(y : number) : Array<Block> {
            return this.grid.slice(y*WIDTH, (y+1)*WIDTH);
        }

        healthPercent(x: number, y: number) : number {
            let bl = this.block(x,y);
            if (bl != null)
                return bl.HealthPercent;
            
            return -1;
        }

        isCleared(x: number, y: number) : boolean {
            let bl = this.block(x,y);
            if (bl != null)
                return bl.IsCleared;
            
            return false;
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
        
		addBlockClearedListener(func : BlockClearedListenerFunc) {
		    return this.blockClearedListeners.add(func);
		};
    }
}
