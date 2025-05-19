<template>
  <div class="number-input-wrapper">
    <input
      type="number"
      v-model.number="model"
      :placeholder="placeholder"
      @wheel="(e) => doChange(e.deltaY > 0)"
    />
    <div class="controls">
      <button @pointerdown="holdChange(false)" @pointerup="stopChange()">
        <Icon name="angle-up" />
      </button>
      <button @pointerdown="holdChange(true)" @pointerup="stopChange()">
        <Icon name="angle-down" />
      </button>
      <button class="clear" @click="tryClear()">
        <Icon name="eraser" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "@/components/Icon.vue";

const emit = defineEmits(["clear"]);
const model = defineModel<number | undefined>();
const props = withDefaults(
  defineProps<{
    placeholder?: string;
    default?: number;
    step?: number;
  }>(),
  {
    placeholder: "",
    step: 1,
  },
);

var heldEvent: number = 0;

function tryClear() {
  model.value = props.default;
  emit("clear");
}

function doChange(decrement: boolean) {
  var value = model.value;
  if (value === undefined) {
    value =
      props.default ??
      (!isNaN(Number(props.placeholder)) ? Number(props.placeholder) : 0);
  }
  model.value = value + (decrement ? -props.step : props.step);
}

function holdChange(decrement: boolean = false, timeMS: number = 512) {
  doChange(decrement);

  var nextTimeMS = timeMS > 64 ? timeMS / 2.0 : Math.max(timeMS, 64);
  heldEvent = setTimeout(() => holdChange(decrement, nextTimeMS), timeMS);
}

function stopChange() {
  if (heldEvent !== 0) {
    clearTimeout(heldEvent);
    heldEvent = 0;
  }
}
</script>

<style lang="scss" scoped>
.number-input-wrapper {
  position: relative;
  width: 100%;

  input[type="number"] {
    appearance: textfield;
    min-width: 0;
    width: 100%;
    padding-right: 38px;
  }

  .controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1px;
    row-gap: 1px;

    position: absolute;
    top: 2px;
    right: 2px;
    bottom: 2px;

    button {
      line-height: 0;
      padding: 0 0.2rem;
      margin: 0;
      height: 100%;
    }

    .clear {
      grid-column: 2;
      grid-row: 1 / span 2;
    }
  }
}
</style>
