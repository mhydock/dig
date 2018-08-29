/// <reference path='../Core/Common.ts'/>
/// <reference path='../Core/Item.ts'/>

namespace Digdown.UI {
    var log = Core.log;
    var withSuffix = Core.withSuffix;

    export class ItemBox {
        private itemBox: HTMLDivElement = document.createElement('div');
        private title: HTMLHeadingElement = document.createElement('h4');
        private amountLbl: HTMLLabelElement = document.createElement('label');
        private valueLbl: HTMLLabelElement = document.createElement('label');
        private sellBtn: HTMLButtonElement = document.createElement('button');
        private sell100Btn: HTMLButtonElement = document.createElement('button');
        private sellAllBtn: HTMLButtonElement = document.createElement('button');

        constructor(private game: Game,
                    private item: Core.Item) {
            this.title.textContent = item.Name;
            this.amountLbl.textContent = 'x ' + item.Amount;
            this.valueLbl.textContent = '$ ' + item.Value + ' per';
            this.sellBtn.textContent = 'Sell';
            this.sell100Btn.textContent = 'Sell x100';
            this.sellAllBtn.textContent = 'Sell All';

            this.itemBox.title = item.Description;

            this.sellBtn.onclick = this.clickSellButton;
            this.sell100Btn.onclick = this.clickSell100Button;
            this.sellAllBtn.onclick = this.clickSellAllButton;

            this.checkKnown(item.IsKnown);
            this.checkAmount(item.Amount);
            
            item.addKnownListener(this.checkKnown);
            item.addAmountListener(this.checkAmount);

            this.itemBox.appendChild(this.title);
            this.itemBox.appendChild(this.amountLbl);
            this.itemBox.appendChild(this.valueLbl);
            this.itemBox.appendChild(this.sellBtn);
            this.itemBox.appendChild(this.sell100Btn);
            this.itemBox.appendChild(this.sellAllBtn);
        }

        get ItemBox() {
            return this.itemBox;
        }

        private clickSellButton = () => {
            var sale = this.item.trySell();
            if (sale >= 0)
                this.game.addMoney(sale);
            else
                alert('You cannot sell that item');
        }

        private clickSell100Button = () => {
            var sale = this.item.trySellMany(100);
            if (sale >= 0)
                this.game.addMoney(sale);
            else
                alert('You cannot sell 100 of that item');
        }

        private clickSellAllButton = () => {
            var sale = this.item.trySellAll();
            if (sale >= 0)
                this.game.addMoney(sale);
            else
                alert('You cannot sell those items');
        }
        
        private checkAmount = (amount: number) => {
            this.sellBtn.disabled = amount <= 0;
            this.sell100Btn.disabled = amount < 100;
            
            if (amount < 100)   this.sell100Btn.style.display = 'none';
            else                this.sell100Btn.style.display = 'block';
            
            if (amount < 1000)  this.sellAllBtn.style.display = 'none';
            else                this.sellAllBtn.style.display = 'block';
            
            this.amountLbl.textContent = 'x ' + withSuffix(amount);
            if (amount > 1000)  this.amountLbl.title = String(amount);
            else                this.amountLbl.title = '';
        }
        
        private checkKnown = (known: boolean) => {
            if (known)
                this.itemBox.style.display = 'block';
            else
                this.itemBox.style.display = 'none';
        }
    }
}