import * as techTemplates from "../../assets/tech.json";
import { Technology } from "./Technology";

export class TechnologyTree {
  private technologies: Technology[];
  private techMap: { [key: string]: Technology };

  constructor() {
    this.technologies = [];
    this.techMap = {};
    techTemplates.forEach(t => {
      const tech = new Technology(
        t.name,
        t.baseCost,
        t.dependTech ? this.techMap[t.dependTech] : null,
        t.dependLevel
      );
      this.technologies.push(tech);
      this.techMap[t.id] = tech;
    });
  }

  get Technologies(): Technology[] {
    return this.technologies;
  }

  get TechMap() {
    return this.techMap;
  }
}
