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

    <!-- 기타 입력칸 -->
    <div v-if="showEtcInput" style="margin-top: 8px">
      <input
        class="input-box bodyLight16px"
        type="text"
        placeholder="기타 내용을 입력하세요"
        :value="etcInput"
        @input="handleEtcInput"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
      />
    </div>

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

const ETC_KEY = 'etc';

const internalValue = ref(
  props.multiple ? [...props.modelValue] : props.modelValue
);

const etcInput = ref('');
const isComposing = ref(false);

const showEtcInput = computed(() =>
  props.multiple
    ? internalValue.value.includes(ETC_KEY) || etcInput.value !== ''
    : internalValue.value === ETC_KEY || etcInput.value !== ''
);

const computedSize = computed(() => {
  if (!props.multiple) return 1;
  return Math.min(props.options.length, 5);
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
    if (isComposing.value) return;

    let updatedValue = val;
    if (showEtcInput.value && etcInput.value.trim()) {
      if (props.multiple) {
        updatedValue = val.map((v) => (v === ETC_KEY ? etcInput.value : v));
      } else {
        updatedValue = etcInput.value;
      }
    }

    const isEqual = props.multiple
      ? JSON.stringify(updatedValue) === JSON.stringify(props.modelValue)
      : updatedValue === props.modelValue;

    if (!isEqual) {
      emit('update:modelValue', updatedValue);
      console.log('[최종 선택 옵션]', updatedValue);
    }
  },
  { deep: true }
);

const handleEtcInput = (event) => {
  if (isComposing.value) return;

  const value = event.target.value;
  etcInput.value = value;

  const current = internalValue.value;

  if (props.multiple) {
    const updated = current.map((v) => (v === ETC_KEY ? value : v));
    emit('update:modelValue', updated);
  } else {
    emit('update:modelValue', value);
  }

  console.log('[기타 입력 포함 최종 옵션]', props.modelValue);
};

const onCompositionStart = () => {
  isComposing.value = true;
};
const onCompositionEnd = (event) => {
  isComposing.value = false;
  handleEtcInput(event);
};
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
