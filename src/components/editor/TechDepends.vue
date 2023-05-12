<template>
  <div class="tech-depends">
    <table>
      <thead>
        <th></th>
        <th>Technology</th>
        <th>Min. Level</th>
      </thead>
      <tbody>
        <tr
          v-for="tech in techTree.technologies"
          :class="{ required: dependsOn(tech) }"
          :key="tech.id"
        >
          <td>
            <input
              @click="toggleTech(tech)"
              :checked="dependsOn(tech)"
              type="checkbox"
            />
          </td>
          <td>{{ tech.name }}</td>
          <td>
            <input
              :value="dependLevel(tech)"
              @change="setDependLevel(tech, $event.target.value)"
              type="number"
              :disabled="!dependsOn(tech)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Technology } from "../../scripts/Core/Technology";
import { TechnologyTree } from "../../scripts/Core/TechnologyTree";
import { Tool } from "../../scripts/Core/Tool";

@Component
export default class TechDepends extends Vue {
  @Prop() currTool!: Tool;
  @Prop() techTree!: TechnologyTree;

  findDependency(tech: Technology) {
    return this.currTool.TechDependencies.find((td) => td.tech === tech);
  }

  toggleTech(tech: Technology) {
    const index = this.currTool.TechDependencies.findIndex(
      (td) => td.tech === tech
    );

    if (index >= 0) {
      this.currTool.TechDependencies.splice(index, 1);
    } else {
      this.currTool.TechDependencies.push({
        tech,
        level: 0,
      });
    }
  }

  dependsOn(tech: Technology) {
    return !!this.findDependency(tech);
  }

  dependLevel(tech: Technology) {
    return (this.findDependency(tech) || {}).level || 0;
  }

  setDependLevel(tech: Technology, value: number) {
    const depend = this.findDependency(tech);
    if (depend) this.$set(depend, "level", Math.max(value, 0));
  }
}
</script>

<style lang="scss">
.tech-depends {
  border: 1px solid black;
  max-height: 7rem;
  overflow: auto;
  position: relative;
  flex: 1 1 auto;

  table {
    border-spacing: 0;
    width: 100%;
  }

  table thead {
    position: sticky;
    top: 0px;
    z-index: 5;
    th {
      background: white;
      border-bottom: 1px solid black;
      line-height: 1.5rem;
      white-space: nowrap;
    }

    th:first-child,
    th:last-child {
      width: 0;
    }
  }

  table tbody {
    tr {
      color: #777;

      input {
        width: 100%;
      }

      &:nth-child(2n + 1) {
        background: #eee;
      }

      &.required {
        color: inherit;
      }
    }
  }

  input[type="checkbox"] {
    width: 1.25rem;
    height: 1.25rem;
    margin: 0.25rem;
    vertical-align: middle;

    &:checked::after {
      font-size: 2rem;
    }
  }
}
</style>
