namespace Digdown.Core {
    export class ItemsInventory {
   
        private items : { [key: string] : Item } = {
            'CMDIRT': new Item('Common Dirt',       'Just some dirt, no big deal.',                             0, 1,   true),
            'TFCLAY': new Item('Tough Clay',        'Tough clay, not good for much.',                           0, 2,   false),
            'GDDIRT': new Item('Quality Topsoil',   'The good stuff; great for gardens.',                       0, 3,   false),
            'SFCLAY': new Item('Soft Clay',         'Soft, smooth clay; great for ceramics.',                   0, 4,   false),
            'GRAVEL': new Item('Gravel',            'Tiny rocks, good for cheap driveways/parking lots.',       0, 5,   false),
            'SMSTNS': new Item('Small Stones',      'Small, smooth rocks. Would look nice in a garden.',        0, 10,  false),
            'LGSTNS': new Item('Large Stones',      'Large, heavy stones. Could have decorative uses?',         0, 25,  false),
            'HGSTNS': new Item('Huge Stones',       'Very large stones. Can probably be used in sculpture.',    0, 50,  false),
            'BOULDR': new Item('Boulder',           'A huge rock; not much you can do with it but break it.',   0, 100, false),
        }
        
        get Items() {
            return this.items;
        }
    }
}