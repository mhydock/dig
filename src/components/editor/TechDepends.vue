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
              @change="setDependLevel(tech, $event.target)"
              type="number"
              :disabled="!dependsOn(tech)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { Technology } from "../../scripts/Core/Technology";
import { TechnologyTree } from "../../scripts/Core/TechnologyTree";
import { Tool } from "../../scripts/Core/Tool";

const props = defineProps<{
  currTool: Tool;
  techTree: TechnologyTree;
}>();

const { currTool, techTree } = props;

function findDependency(tech: Technology) {
  return currTool.techDepends.find((td) => td.tech === tech);
}

function toggleTech(tech: Technology) {
  const index = currTool.techDepends.findIndex((td) => td.tech === tech);

  if (index >= 0) {
    currTool.techDepends.splice(index, 1);
  } else {
    currTool.techDepends.push({
      tech,
      level: 0,
    });
  }
}

function dependsOn(tech: Technology) {
  return !!findDependency(tech);
}

function dependLevel(tech: Technology) {
  return (findDependency(tech) || {}).level || 0;
}

function setDependLevel(tech: Technology, eventTarget: EventTarget | null) {
  const value = (eventTarget as HTMLInputElement).valueAsNumber;
  const depend = findDependency(tech);
  if (depend) depend.level = Math.max(value, 0);
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
      max-height: 1.25rem;
    }
  }
}
</style>
