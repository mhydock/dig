/// <reference path='../Core/Common.ts'/>

namespace Digdown.UI {
    import log = Core.log;

    export class Main {
       
        private game: Game;
        private grid: GameGrid;

        private wrapper: HTMLDivElement = <HTMLDivElement>document.getElementById('wrapper');
        private tooltip: HTMLDivElement = <HTMLDivElement>document.getElementById('tooltip');
        private gameScreen: HTMLDivElement = <HTMLDivElement>document.getElementById('gameScreen');
        private progCursor: HTMLDivElement = <HTMLDivElement>document.getElementById('progCursor');
        
        private moneyDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('money');
        
        private toolsTab: HTMLLIElement = <HTMLLIElement>document.getElementById('tools');
        private itemsTab: HTMLLIElement = <HTMLLIElement>document.getElementById('items');
        private econTab: HTMLLIElement = <HTMLLIElement>document.getElementById('econ');
        private techTab: HTMLLIElement = <HTMLLIElement>document.getElementById('tech');
        private busiTab: HTMLLIElement = <HTMLLIElement>document.getElementById('busi');

        private toolBoxList: HTMLDivElement = <HTMLDivElement>document.getElementById('toolsList');
        private itemBoxList: HTMLDivElement = <HTMLDivElement>document.getElementById('itemsList');
        private econBoxList: HTMLDivElement = <HTMLDivElement>document.getElementById('econList');
        private techBoxList: HTMLDivElement = <HTMLDivElement>document.getElementById('techList');
        private busiBoxList: HTMLDivElement = <HTMLDivElement>document.getElementById('busiList');
        
        constructor() {
            log("Game has begun");
            this.game = new Game();
            this.grid = new TextGrid(this.game.Player, this.game.Grid);

            var tools = this.game.ToolsInventory.Tools;
            for (var t in tools) {
                let box = new ToolBox(this.game, tools[t]);
                this.toolBoxList.appendChild(box.ToolBox);
            }

            var items = this.game.ItemsInventory.Items;
            for (var i in items) {
                let box = new ItemBox(this.game, items[i]);
                this.itemBoxList.appendChild(box.ItemBox);
            }
            
            var techs = this.game.TechnologyTree.Technologies;
            for (var h in techs) {
                let box = new TechBox(this.game, techs[h]);
                this.techBoxList.appendChild(box.TechBox);
            }

            this.toolsTab.onclick = this.changeTab(this.toolsTab, this.toolBoxList);
            this.itemsTab.onclick = this.changeTab(this.itemsTab, this.itemBoxList);            
            this.econTab.onclick = this.changeTab(this.econTab, this.econBoxList);            
            this.techTab.onclick = this.changeTab(this.techTab, this.techBoxList);            
            this.busiTab.onclick = this.changeTab(this.busiTab, this.busiBoxList);

            var fontSize = this.gameScreen.style.fontSize;
            var tileSize = Number(fontSize.substr(0, fontSize.length-2));
            this.grid.setTileSize(tileSize);
            
            window.onresize = this.onResizeFunc;
            this.onResizeFunc();
            
            this.updateMoney(this.game.Money);
            this.game.addMoneyListener(this.updateMoney);

            this.gameScreen.onmousemove = this.updateHover;
            this.gameScreen.onmouseleave = this.hideTooltip;
            document.onkeydown = this.onKeyDownFunc;

            this.techTab.click();
            this.toolsTab.click();

            this.grid.render();
        }

        private updateMoney = (money: number) => {
            this.moneyDiv.textContent = '$ ' + money
        }

        private getHoverText(x: number, y: number) : string {
            var {row, col} = this.grid.normalizeXY(x, y);

            if (row == this.game.Player.Y && col == this.game.Player.X)
                return 'Power: ' + this.game.PlayerPower;
            
            if (row < 0)
                return null;

            var tt = this.game.Grid.getTooltipText(col, row);
            
            var text = `<label>${block.TypePhrase}</label><br/>`;
            text += 'HP: ' + Math.ceil(health*dura) + '/' + dura;
            return text;
        };
        
        private updateHover = (event: MouseEvent) => {
            var x = event.pageX - this.gameScreen.offsetLeft;
            var y = event.pageY - this.gameScreen.offsetTop;
            
            var hoverText = this.game.getHoverText(x, y);
            if (hoverText === null) {
                this.tooltip.style.display = 'none';
                return;
            }
            
            this.tooltip.innerHTML = this.game.getHoverText(x, y);
            this.tooltip.style.top = (event.pageY+2)+'px';
            this.tooltip.style.left = (event.pageX+2)+'px';
            this.tooltip.style.display = 'block';
        }

        private hideTooltip = () => {
            this.tooltip.style.display = 'none';
        }
        
        private onResizeFunc = () => {
            this.wrapper.style.height = window.innerHeight + 'px';
            this.grid.ViewRows(this.gameScreen.offsetHeight);
        }
        
        // keycodes found here http://www.javascriptkeycode.com/
        private onKeyDownFunc = (event: KeyboardEvent) => {
            if (event.which == 37)          // left arrow
                this.game.moveLeft();
            if (event.which == 38)          // up arrow
                this.game.moveUp();
            if (event.which == 39)          // right arrow
                this.game.moveRight();
            if (event.which == 40)          // down arrow
                this.game.moveDown();

            this.progCursor.style.top = this.game.Progress + '%';
            this.grid.render();
        }

        // this is safe only because `this` isn't being used
        private changeTab(tab: HTMLLIElement, list: HTMLDivElement) {
            return function() {
                log('doing a thing');
                var parent = tab.parentElement;
                var select = parent.querySelector('.selected');
                if (select === tab)
                    return;
                
                var content = parent.parentElement.querySelector('.content');
                for (let node of content.children) {
                    (<HTMLElement>node).style.display = 'none';
                }
                list.style.display = 'block';
                
                if (select)
                    select.classList.remove('selected');
                
                tab.classList.add('selected');
            }
        }
    }
}