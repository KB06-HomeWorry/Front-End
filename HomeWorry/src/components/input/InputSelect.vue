<template>
  <div class="input-field">
    <label class="input-label bodyMedium20px">{{ label }}</label>
    <select
      class="input-box bodyLight16px"
      v-model="internalValue"
      :disabled="disabled"
      :class="{ 'is-placeholder': isPlaceholderSelected }"
    >
      <option disabled value="">
        {{ placeholder }}
      </option>
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
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  desc: String,
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue);

const isPlaceholderSelected = computed(() => {
  return internalValue.value === '' || internalValue.value === null;
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== internalValue.value) {
      internalValue.value = newVal;
    }
  }
);

watch(internalValue, (val) => {
  if (val !== props.modelValue) {
    emit('update:modelValue', val);
  }
});
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

.input-box.is-placeholder {
  color: var(--color-mediumgray);
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
