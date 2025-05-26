<template>
  <div class="multi-input">
    <div>
      <label>a</label>
      <NumberInput v-model="model.a" placeholder="1" />
    </div>
    <div v-if="functionType !== FuncType.LINEAR">
      <label>b</label>
      <NumberInput
        v-model="model.b"
        :placeholder="isAsymp ? 'e' : '1'"
        :default="isAsymp ? Math.E : 1"
        :step="isExpo ? 0.02 : 1"
      />
    </div>
    <div v-if="functionType === FuncType.CUBIC">
      <label>c</label>
      <NumberInput v-model="model.c" placeholder="1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { Coefficients, FuncType } from "@/scripts/Core/Common";

import NumberInput from "./NumberInput.vue";

const model = defineModel<Coefficients>({ required: true });
const props = defineProps<{
  functionType: FuncType;
}>();

const isExpo = computed(() => props.functionType === FuncType.EXPONENTIAL);
const isAsymp = computed(() => props.functionType === FuncType.ASYMPTOTIC);
</script>

<style lang="scss">
.multi-input {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 1rem;
  align-items: center;
  text-align: left;
  margin: 0;
  padding: 0;

  div {
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;
  }

  label {
    width: auto;
    margin-right: 0.5rem;
  }

  input[type="number"] {
    appearance: textfield;
    min-width: 0;
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
