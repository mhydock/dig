import { Game } from "../Core/Game";
import { Technology } from "../Core/Technology";

export class TechBox {
  private techBox: HTMLDivElement = document.createElement("div");
  private title: HTMLHeadingElement = document.createElement("h3");
  private levelLbl: HTMLLabelElement = document.createElement("label");
  private resCostLbl: HTMLLabelElement = document.createElement("label");
  private researchBtn: HTMLButtonElement = document.createElement("button");

  constructor(private game: Game, private tech: Technology) {
    this.title.textContent = tech.Name;
    this.researchBtn.textContent = "Research";
    this.researchBtn.onclick = this.clickResearchButton;

    this.checkCost(tech.ResearchCost);
    this.checkLevel(tech.Level);
    this.checkVisibility(tech.IsVisible);

    tech.addCostListener(this.checkCost);
    tech.addLevelListener(this.checkLevel);
    tech.addVisibilityListener(this.checkVisibility);

    this.checkMoney(game.Money);
    game.addMoneyListener(this.checkMoney);

    this.techBox.appendChild(this.title);
    this.techBox.appendChild(this.levelLbl);
    this.techBox.appendChild(this.resCostLbl);
    this.techBox.appendChild(this.researchBtn);
  }

  get TechBox() {
    return this.techBox;
  }

  private clickResearchButton = () => {
    const cost = this.tech.tryResearch(this.game.Money);
    if (cost >= 0) this.game.subMoney(cost);
    else alert("You do not have enough money to research " + this.tech.Name);
  };

  private checkCost = (cost: number) => {
    this.resCostLbl.textContent = "Next: $ " + cost;
    if (cost > this.game.Money) this.researchBtn.disabled = true;
  };

  private checkMoney = (money: number) => {
    if (money < this.tech.ResearchCost) this.researchBtn.disabled = true;
    else this.researchBtn.disabled = false;
  };

  private checkLevel = (level: number) => {
    this.levelLbl.textContent = "Level: " + level;
  };

  private checkVisibility = (visible: boolean) => {
    if (visible) this.techBox.style.display = "block";
    else this.techBox.style.display = "none";
  };
}
