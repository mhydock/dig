/// <reference path='../Core/Grid.ts'/>
/// <reference path='../Core/Player.ts'/>

namespace DigDown.UI {
    export interface GameGrid {

        TileSize: number,
        ViewRows: number,
        YOffset: number,

        GameGrid: Core.Grid,
        Player: Core.Player,
        Screen: HTMLDivElement

        render() : void
    }
}