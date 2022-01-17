<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Tool } from "../../scripts/Core/Tool";

@Component
export default class GridView extends Vue {
  SHADES = 15; // not counting white

  @Prop() currTool!: Tool;

  gridDims = { width: 0, height: 0 };
  currIntensity = 0;

  constructor() {
    super();
  }

  mounted() {
    const grid = this.$refs["grid"] as HTMLDivElement;
    if (grid) {
      this.gridDims.width = grid.offsetWidth;
      this.gridDims.height = grid.offsetHeight;
    }
  }

  getShadeFromIndex(intensity: number) {
    return this.getShade(intensity / this.SHADES);
  }

  getShade(intensity = 0) {
    const i = Math.max(255 - 255 * intensity, 0);
    return `rgba(${i}, ${i}, ${i}, 1)`;
  }

  setIntensity(row: number, col: number) {
    this.$set(
      this.currTool.CollisionMask[row],
      col,
      this.currIntensity / this.SHADES
    );
  }
}
</script>
