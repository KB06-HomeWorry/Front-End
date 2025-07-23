<template>
  <div class="input-field">
    <label class="input-label bodyMedium20px">{{ label }}</label>
    <select
      class="input-box bodyLight16px"
      v-model="internalValue"
      :disabled="disabled"
      :multiple="multiple"
      :size="computedSize"
    >
      <option v-if="!multiple" disabled value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value ?? option.label"
        :value="option.value ?? option.label"
      >
        {{ option.label ?? option.value }}
      </option>
    </select>

    <div class="input-desc bodyLight12px" v-if="desc">{{ desc }}</div>
    <div class="space"></div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: {
    type: [String, Array],
    default: () => [],
  },
  options: {
    type: Array,
    default: () => [],
  },
  desc: String,
  disabled: Boolean,
  multiple: Boolean,
});
const emit = defineEmits(['update:modelValue']);

const internalValue = ref(
  props.multiple ? [...props.modelValue] : props.modelValue
);

const computedSize = computed(() => {
  if (!props.multiple) return 1;
  return Math.min(props.options.length, 3);
});

watch(
  () => props.modelValue,
  (newVal) => {
    const isEqual = props.multiple
      ? JSON.stringify(newVal) === JSON.stringify(internalValue.value)
      : newVal === internalValue.value;

    if (!isEqual) {
      internalValue.value = props.multiple ? [...newVal] : newVal;
    }
  },
  { deep: true }
);

watch(
  internalValue,
  (val) => {
    const isEqual = props.multiple
      ? JSON.stringify(val) === JSON.stringify(props.modelValue)
      : val === props.modelValue;

    if (!isEqual) {
      emit('update:modelValue', val);
      console.log('[최종 선택 옵션]', val);
    }
  },
  { deep: true }
);
</script>

<style scoped>
.input-field {
  width: 100%;
}

.input-label {
  margin-bottom: 5px;
  display: block;
  color: var(--color-primary);
}

.input-box {
  width: 100%;
  height: auto;
  min-height: 50px;
  border-radius: 12px;
  border: 1px solid var(--color-light);
  padding: 8px 16px;
  box-sizing: border-box;
  background: var(--color-white);
  transition: border 0.2s;
  appearance: none;
  overflow-y: auto;
}

.input-box:focus {
  border-color: var(--color-primary);
  outline: none;
}

.input-desc {
  letter-spacing: -0.03em;
  color: var(--color-mediumgray);
  margin: 4px 0;
}

.space {
  height: 18px;
}
</style>
