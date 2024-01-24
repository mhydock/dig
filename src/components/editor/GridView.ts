import { onBeforeUnmount, onMounted, Ref, ref } from "vue";

export const SHADES = 15; // not counting white

export function getShadeFromIndex(intensity: number) {
  return getShade(intensity / SHADES);
}

export function getShade(intensity = 0) {
  const i = Math.max(255 - 255 * intensity, 0);
  return `rgba(${i}, ${i}, ${i}, 1)`;
}

export function useGridView(grid: Ref<HTMLDivElement | null>) {
  const gridDims = ref({ width: 0, height: 0 });

  let resizeObserver: ResizeObserver;

  function getGridDims() {
    if (grid.value) {
      gridDims.value.width = grid.value.offsetWidth;
      gridDims.value.height = grid.value.offsetHeight;
    }
  }

  onMounted(() => {
    resizeObserver = new ResizeObserver(getGridDims);
    resizeObserver.observe(grid.value as HTMLDivElement);
  });

  onBeforeUnmount(() => {
    resizeObserver.unobserve(grid.value as HTMLDivElement);
  });

  return { gridDims };
}
