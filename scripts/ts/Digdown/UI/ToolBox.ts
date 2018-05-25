/// <reference path='../Core/Common.ts'/>
/// <reference path='../Core/Tool.ts'/>

namespace Digdown.UI {
    import log = Core.log;
    import withSuffix = Core.withSuffix;
    
    export class ToolBox {
        private toolBox: HTMLDivElement = document.createElement('div');
        private title: HTMLHeadingElement = document.createElement('h3');
        private amountLbl: HTMLLabelElement = document.createElement('label');
        private buyCostLbl: HTMLLabelElement = document.createElement('label');   
        private buyBtn: HTMLButtonElement = document.createElement('button');
        private sellBtn: HTMLButtonElement = document.createElement('button');

        constructor (private game: Game,
                     private tool: Core.Tool) {
            this.buyBtn.textContent = 'Buy';
            this.sellBtn.textContent = 'Sell';

            this.title.textContent = this.tool.Name;
            this.buyBtn.click = this.clickBuyButton;
            this.sellBtn.click = this.clickSellButton;
            
            this.checkCost(tool.BuyCost);
            this.checkAmount(tool.Amount);
            
            tool.addCostListener(this.checkCost);
            tool.addAmountListener(this.checkAmount);
    
            this.checkMoney(game.Money);
            game.addMoneyListener(this.checkMoney);
            
            var tech = tool.Technology;
            this.checkResearched(tech.Level);
            tech.addLevelListener(this.checkResearched);
                
            this.toolBox.appendChild(this.title);
            this.toolBox.appendChild(this.amountLbl);
            this.toolBox.appendChild(this.buyCostLbl);
            this.toolBox.appendChild(this.buyBtn);
            this.toolBox.appendChild(this.sellBtn);
        }

        get ToolBox() {
            return this.toolBox;
        }

        private clickBuyButton = () => {
            var cost = this.tool.tryBuy(this.game.Money);
            if (cost >= 0)
                this.game.subMoney(cost);
            else
                alert('You do not have enough money to buy a ' + this.tool.Name);
        }

        private clickSellButton = () => {
            var sale = this.tool.trySell();
            if (sale >= 0)
                this.game.addMoney(sale);
            else
                alert('You cannot sell that tool');
        }

        private checkCost = (cost: number) => {
            this.buyCostLbl.textContent = 'Next: $ ' + cost;
            if (cost > this.game.Money)
                this.buyBtn.disabled = true;
        }
        
        private checkMoney = (money: number) => {
            if (money < this.tool.BuyCost)
                this.buyBtn.disabled = true;
            else
                this.buyBtn.disabled = false;
        }
        
        private checkAmount = (amount: number) => {
            this.sellBtn.disabled = amount <= 0;
            this.amountLbl.textContent = 'x ' + withSuffix(amount);
            if (amount > 1000)  this.amountLbl.title = String(amount);
            else                this.amountLbl.title = '';
        }
        
        private checkResearched = (level: number) => {
            if (level >= this.tool.MinTechLevel || this.tool.IsKnown)
                this.toolBox.style.display = 'block';
            else
                this.toolBox.style.display = 'none';
        }
    }
}