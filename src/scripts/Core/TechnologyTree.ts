import techTemplates from "../../assets/tech.json";
import { Technology } from "./Technology";

export class TechnologyTree {
  public technologies: Technology[];
  public techMap: { [key: string]: Technology };

  constructor() {
    this.technologies = [];
    this.techMap = {};
    techTemplates.forEach((t) => {
      const tech = new Technology(
        t.id,
        t.name,
        t.baseCost,
        t.techDepends.map((td) => ({
          tech: this.techMap[td.tech],
          level: td.level,
        })),
      );
      this.technologies.push(tech);
      this.techMap[t.id] = tech;
    });
  }

  keyFor(tech: Technology) {
    return (
      (Object.entries(this.techMap).find((kvp) => kvp[1] === tech) || [])[0] ||
      ""
    );
  }
}
