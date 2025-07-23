<template>
  <div class="input-field">
    <label class="input-label bodyMedium20px">{{ label }}</label>
    <slot>
      <input
        class="input-box bodyMedium16px"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
      />
    </slot>
    <div class="input-desc bodyLight12px" v-if="desc">{{ desc }}</div>

    <!-- 에러 메시지는 항상 공간 차지하도록 설정하였음.내용만 토글 -->
    <div
      class="input-error bodyLight12px"
      :class="{ 'input-error--active': error }"
      aria-live="polite"
    >
      {{ error || '\u00A0' }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
  type: { type: String, default: 'text' },
  desc: String,
  error: String,
  disabled: Boolean,
});
const emit = defineEmits(['update:modelValue']);
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
  height: 50px;
  border-radius: 12px;
  border: 1px solid var(--color-light);
  padding: 0 16px;
  /* margin-bottom: 8px; */
  box-sizing: border-box;
  background: var(--color-white);
  transition: border 0.2s;
}

/* 포커스 시 테두리 컬러 */
.input-box:focus {
  border-color: var(--color-primary);
}

.input-box::placeholder {
  color: var(--color-mediumgray);
}

/* 설명 */
.input-desc {
  letter-spacing: -0.03em;
  color: var(--color-mediumgray);
  margin-bottom: 4px;
}

/* 에러 */
.input-error {
  color: #BF0000;
  font-weight: 700;
  margin-bottom: 4px;
  min-height: 18px; 
  line-height: 1.5;
  opacity: 0;
  transition: opacity 0.2s;
}

.input-error--active {
  opacity: 1;
}
</style>
