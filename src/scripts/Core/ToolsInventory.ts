/// <reference path='Grid.ts'/>
/// <reference path='TechnologyTree.ts'/>

namespace Digdown.Core {
    export class ToolsInventory {

        constructor(private techTree : TechnologyTree) {
            if (typeof techTree === 'undefined' || techTree == null)
                throw 'Tech Tree is undefined or null. Cannot create tools.';
        }
        
        private tools : { [key: string] : Tool } = {
            'Trowel' : new Tool('Trowel',                1, 1,      5            , this.techTree.SHOVEL, 1, 0),
            'GdHose' : new Tool('Garden Hose',           0, 2,      10           , this.techTree.WATER1, 1, 1),
            'Shovel' : new Tool('Shovel',                1, 4,      20           , this.techTree.SHOVEL, 1, 1),
            'PickAx' : new Tool('Pickaxe',               0, 30,     50           , this.techTree.HAMMER, 1, 1),
            'Sledge' : new Tool('Sledge Hammer',         0, 40,     100          , this.techTree.HAMMER, 1, 2),
            'PrsWsh' : new Tool('Pressure Washer',       0, 100,    300          , this.techTree.WATER2, 1, 1),
            'FrHose' : new Tool('Firehose',              0, 200,    200          , this.techTree.WATER1, 1, 2),
            'JakHmr' : new Tool('Jackhammer',            0, 200,    500          , this.techTree.HAMMER, 1, 3),
            'SDrill' : new Tool('Small Drill',           0, 400,    1200         , this.techTree.DRILLS, 1, 1),     // well-boring drill
            'SXcvtr' : new Tool('Small Excavator',       0, 1000,   25000        , this.techTree.SHOVEL, 1, 2),     // small, Bobcat-esque excavator
            'HydMin' : new Tool('Hydraulic Mining',      0, 2000,   5000         , this.techTree.WATER2, 1, 2),
            'MDrill' : new Tool('Medium Drill',          0, 4000,   10000        , this.techTree.DRILLS, 1, 2),     // subway tunnel drill
            'MXcvtr' : new Tool('Medium Excavator',      0, 8000,   150000       , this.techTree.SHOVEL, 1, 3),     // small/medium construction excavator
            'Dynmte' : new Tool('Dynamite',              0, 4000,   15000        , this.techTree.EXPLOS, 1, 1),
            'LDrill' : new Tool('Large Drill',           0, 10000,  500000       , this.techTree.DRILLS, 1, 3),     // mountain tunnel drill
            'LXcvtr' : new Tool('Large Excavator',       0, 20000,  300000       , this.techTree.SHOVEL, 1, 4),     // large construction excavator
            'PolExp' : new Tool('Polymer Explosives',    0, 40000,  150000       , this.techTree.EXPLOS, 1, 2),
            'GDrill' : new Tool('GIGA DRILL',            0, 100000, 80000000     , this.techTree.DRILLS, 1, 4),     // Big Bertha, world's largest drill
            'Bagger' : new Tool('GIANT EXCAVATOR',       0, 200000, 100000000    , this.techTree.SHOVEL, 1, 5),     // Bagger 293, world's largest excavator
            'NukExp' : new Tool('Nuclear Explosives',    0, 400000, 1000000000   , this.techTree.EXPLOS, 1, 3),
        }

        get Tools() { 
            return this.tools;
        }
        
        get Power() : number {
            var total = 0; 
            for (var i in this.tools)
            {
                if (this.tools.hasOwnProperty(i))
                    total += this.tools[i].TotalPower;
            }
            return total;
        }
        
        canMoveAndStep() : boolean { 
            return  this.tools['Shovel'].Amount > 0 ||
                    this.tools['SDrill'].Amount > 0 ||
                    this.tools['LDrill'].Amount > 0 ||
                    this.tools['GDrill'].Amount > 0;
        }

        dig(grid : Grid, x : number, y : number, orient: Orientation) : number {
            return 0;
        }
    }
}