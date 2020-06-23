/// <reference path='../Core/Common.ts'/>
/// <reference path='../Core/Player.ts'/>
/// <reference path='../Core/Grid.ts'/>

namespace DigDown.UI {
    import log = Core.log;
    import Orientation = Core.Orientation;

    export class TextGrid implements GameGrid {
        private static SPRITE_LIST = [
            '\u2593',
            '\u2592',
            '\u2591',
            '%',
            '#',
            '=',
            '?',
            '&amp;',
        ];

        private gameGrid: Core.Grid;
        private player: Core.Player;
        private screen: HTMLDivElement;

        private viewRows = 100;
        private fontSize = 16;
        private yOffset = 0;

        get GameGrid(): Core.Grid {
            return this.gameGrid;
        }
        
        get Player(): Core.Player {
            return this.player;
        }
        
        get Screen(): HTMLDivElement {
            return this.screen;
        }

        get TileSize(): number {
            return this.fontSize;
        }

        set TileSize(size: number) {
            this.fontSize = size;
        }

        get ViewRows(): number {
            return this.viewRows;
        }

        set ViewRows(height: number) {
            this.viewRows = Math.ceil(height / this.TileSize);
            
            log('view rows: ' + this.viewRows);
        }

        get YOffset(): number {
            return this.yOffset;
        }

        constructor(
            gameGrid: Core.Grid,
            player: Core.Player,
            screen: HTMLDivElement
        ) {
            this.gameGrid = gameGrid
            this.player = player;
            this.screen = screen;
        }

        normalizeXY(x: number, y: number) : {row: number, col: number} {
            // border offset (1px all sides)
            x -= 2;
            y -= 2;
            
            if (x < 0 || y < 0)
                return null;
            
            var row = Math.floor(y/this.TileSize);      // height of row == height of text
            var col = Math.floor(x/this.TileSize*2);    // text half as wide as tall
            
            row += this.YOffset;

            return {row, col};
        }

        render(): void {
            var maxRows = this.ViewRows;
            var maxSky = Math.ceil(maxRows/3);
            
            log('maxSky: ' + maxSky);
            
            var bottomRow = this.player.Y + Math.ceil(maxRows/2);
            if (bottomRow > this.gameGrid.Height) bottomRow = this.gameGrid.Height;
            
            var sky = 0;
            var topRow = bottomRow - maxRows;
            if (topRow < 0)
            {
                sky = -topRow;
                topRow = 0;
                
                if (sky > maxSky)
                {
                    sky = maxSky;
                    bottomRow += sky;
                }
            }
            
            this.yOffset = sky > 0 ? -sky : topRow;
            
            var i, j;
            var output = '';
            log("generating sky");
            for (i = 0; i < sky; i++)
            {
                for (j = 0; j < this.gameGrid.Width; j++)
                    output += this._getEmptyOrPlayer(j, i-sky);
                    
                output += '</br>';
            }              
            
            log("generating ground");
            for (i = topRow; i < bottomRow; i++)
            { 
                for (j = 0; j < this.gameGrid.Width; j++)
                {
                    var block = this.gameGrid.block(j, i);
                    if (block == null)
                        continue;

                    var type = block.Type;
                    var dura = block.Durability;

                    if (block.IsCleared)
                        output += this._getEmptyOrPlayer(j, i);
                    else
                        output += TextGrid.SPRITE_LIST[type];
                }
                output += '<br/>';
            }

            this.screen.innerText = output;
        }

        private _getOrientationGlyph() : string {
            var orient = this.player.orient;
            
            if (orient == Orientation.NORTH)
                return '^';
            if (orient == Orientation.SOUTH)
                return 'v';
            if (orient == Orientation.EAST)
                return '>';
            if (orient == Orientation.WEST)
                return '<';
                
            return '';
        }

        private _getEmptyOrPlayer(x: number, y: number) : string {  
            if (y == this.player.Y && x == this.player.X)
                return this._getOrientationGlyph();

            return '&nbsp;';
        }
    }
}