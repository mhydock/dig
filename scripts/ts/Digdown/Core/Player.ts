namespace Digdown.Core {

    export class Player {
        constructor (private x: number,
                     private y: number) {}

        orient = Orientation.SOUTH;

        grid : Grid;
        tools : ToolsInventory;    

        step(x: number, y: number) : number {
            if (x < 0 || x >= this.grid.Width ||
                y < -1 || y >= this.grid.Height)
                return -1;
            
            log('Attempting to move to [' + x + ',' + y + ']');

            // if player is above ground, just let them move.
            if (this.y == -1 && y == this.y)
            {
                log('Player is above ground');
                this.x = x;
                return 0;            
            }
                
            if (this.grid.isCleared(x, y))
            {
                log('Path is clear');
                this.y = y;
                this.x = x;
                return -1;            
            }
            else
            {
                log('Path is not clear');
                var damage = this.tools.dig(this.grid, x, y, this.orient);
                
                if (this.tools.canMoveAndStep() &&
                    this.grid.isCleared(x,y))
                {
                    this.y = y;
                    this.x = x;
                }
                
                return damage;   
            }
        }
        
        moveUp() : number {
            this.orient = Orientation.NORTH;
            return this.step(this.x, this.y-1);
        }
        
        moveDown() : number {
            this.orient = Orientation.SOUTH;
            return this.step(this.x, this.y+1);
        }
        
        moveLeft() : number {
            this.orient = Orientation.WEST;
            return this.step(this.x-1, this.y);
        }
        
        moveRight() : number {
            this.orient = Orientation.EAST;
            return this.step(this.x+1, this.y);
        }

        faceUp() : void {
            this.orient = Orientation.NORTH;
        }
        
        faceDown() : void {
            this.orient = Orientation.SOUTH;
        }
        
        faceLeft() : void {
            this.orient = Orientation.WEST;
        }
        
        faceRight() : void {
            this.orient = Orientation.EAST;
        }
        
        get X() : number {
            return this.x;
        }
        
        get Y() : number {
            return this.y;
        }

        get Orientation() : number {
            return this.orient;
        }
    }
}