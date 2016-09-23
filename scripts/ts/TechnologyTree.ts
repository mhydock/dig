/// <reference path='Technology.ts'/>

namespace Digdown.Core {
    export class TechnologyTree {
        private shovel = new Technology('Shovels and Diggers',                  100,    true,   null,   0);
        private hammer = new Technology('Hammers and Picks',                    500,    false,  this.shovel, 1);
        private drills = new Technology('Drills and Borers',                    1000,   false,  this.hammer, 1);
        private water1 = new Technology('Low-Pressure Water-based Erosion',     100,    false,  this.shovel, 1);
        private water2 = new Technology('High-pressure Water-based Erosion',    1000,   false,  this.water1, 2);
        private explos = new Technology('Explosives',                           1000,   false,  this.hammer, 3);        
        
        get SHOVEL() { return this.shovel; }
        get HAMMER() { return this.hammer; }
        get DRILLS() { return this.drills; }
        get WATER1() { return this.water1; }
        get WATER2() { return this.water2; }
        get EXPLOS() { return this.explos; }
    }
}