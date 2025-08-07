<template>
  <div class="input-field">
    <label class="input-label bodyMedium18px">{{ label }}</label>
    <div class="select-wrapper">
      <select
        class="input-box bodyMedium16px "
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
      <!-- 우측 화살표 아이콘 -->
      <span class="dropdown-arrow">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M5 8l5 5 5-5" stroke="#8C8C8C" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>
      </span>
    </div>

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

/* 셀렉트+화살표 감싸는 래퍼 */
.select-wrapper {
  position: relative;
  width: 100%;
}

/* select 자체 커스텀 */
.input-box {
  width: 100%;
  min-height: 50px;
  border-radius: 12px;
  border: 1px solid var(--color-light);
  padding: 8px 40px 8px 16px; /* 우측에 화살표 공간 확보 */
  box-sizing: border-box;
  background: var(--color-white);
  transition: border 0.2s;
  appearance: none;
  overflow-y: auto;
  color: var(--color-primary);
}

/* 우측 화살표 */
.dropdown-arrow {
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

.input-box:focus {
  border-color: var(--color-primary);
  outline: none;
}

.input-box.is-placeholder {
  color: var(--color-mediumgray);
}

.space {
  height: 18px;
}
</style>
