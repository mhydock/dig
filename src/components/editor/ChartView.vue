<template>
  <div class="grid-view-wrapper">
    <Line :data="points" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";

import { Tool } from "../../scripts/Core/Tool";
import { withSuffix } from "@/scripts/Core/Common";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

ChartJS.defaults.borderColor = "#000";
ChartJS.defaults.font.family = "'Ubuntu Mono', monospace";
ChartJS.defaults.font.size = 16;
ChartJS.defaults.color = "#000";
ChartJS.defaults.elements.point.pointStyle = false;
ChartJS.defaults.plugins.tooltip.backgroundColor = "#fff";
ChartJS.defaults.plugins.tooltip.borderColor = "#000";
ChartJS.defaults.plugins.tooltip.borderWidth = 1;
ChartJS.defaults.plugins.tooltip.cornerRadius = 0;
ChartJS.defaults.plugins.tooltip.bodyColor = "#000";
ChartJS.defaults.plugins.tooltip.titleColor = "#000";
ChartJS.defaults.plugins.tooltip.footerColor = "#000";

const props = defineProps<{
  currTool: Tool;
}>();

const { currTool } = props;

const powerPoints = computed(() =>
  Array(101)
    .fill(0)
    .map((_, i) => [i, currTool.powerFunc(currTool.basePower, i)]),
);
const costPoints = computed(() =>
  Array(101)
    .fill(0)
    .map((_, i) => [i, currTool.costFunc(currTool.baseCost, i)]),
);

const points = computed(() => ({
  datasets: [
    {
      label: "Power",
      data: powerPoints.value,
      backgroundColor: "#000",
      borderColor: "#000",
      yAxisID: "power",
    },
    {
      label: "Cost",
      data: costPoints.value,
      backgroundColor: "#666",
      borderColor: "#666",
      yAxisID: "money",
    },
  ],
}));

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    money: {
      title: {
        display: true,
        text: "Money",
      },
      ticks: {
        callback: (val: number) => "$" + withSuffix(val),
        count: 11,
      },
      position: "right",
      grid: {
            color: ["#000", "#aaa"],
      },
      suggestedMin: 0,
      suggestedMax: Math.floor(costPoints.value.reduce((prev, curr) => curr[1] > prev[1] ? curr : prev)[1] / 10) * 10, 
    },
    power: {
      title: {
        display: true,
        text: "Power",
      },
      ticks: {
        callback: (val: number) => withSuffix(val),
        count: 11,
      },
      position: "left",
      grid: {
            color: ["#000", "#aaa"],
      },
      suggestedMin: 0,
      suggestedMax: Math.floor(powerPoints.value.reduce((prev, curr) => curr[1] > prev[1] ? curr : prev)[1] / 10) * 10, 
    },
    x: {
        type: "linear",
        title: {
            display: true,
            text: "Amount",
        },
        ticks: {
            display: true,
        }
    }
  },
}));
</script>

<style lang="scss" scoped></style>
