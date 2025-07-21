<template>
  <div class="input-field email-input-field">
    <label class="input-label bodyMedium20px">{{ label }}</label>
    <div class="input-and-btn">
      <input
        class="input-box bodyMedium16px"
        type="email"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
        @keyup.enter="$emit('check')"
      />
      <button type="button" class="check-btn bodyMedium12px" @click="$emit('check')" :disabled="disabled">
        중복<br/>확인
      </button>
    </div>
    <div class="input-desc bodyLight12px" v-if="desc">{{ desc }}</div>
    <div
      class="input-error bodyLight12px"
      :class="{ 'input-error--active': !!error }"
      aria-live="polite"
    >
      {{ error || '\u00A0' }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  label: { type: String, default: '이메일을 입력해주세요.' },
  placeholder: { type: String, default: '이메일 주소를 입력하세요.' },
  desc: String,
  error: String,
  disabled: Boolean
})
const emit = defineEmits(['update:modelValue', 'check'])
</script>

<style scoped>
.email-row {
  display: flex;
  align-items: flex-end;
  gap: 4px;
}

.email-input-field {
  flex: none;
  width: 100%;
  min-width: 0;
}

.input-and-btn {
  display: flex;
  align-items: center; /* or baseline, center 둘 다 OK */
  gap: 4px;
}

.input-box {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  border: 1px solid var(--color-light);
  padding: 0 16px;
  box-sizing: border-box;
  background: var(--color-white);
  transition: border 0.2s;
}

.input-label {
  margin-bottom: 5px;
  display: block;
  color: var(--color-primary);
}
.input-box:focus {
  border-color: var(--color-primary);
}
.input-box::placeholder {
  color: var(--color-mediumgray);
}

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
  display: block;
}

.input-error--active {
  opacity: 1;
}

.check-btn {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  cursor: pointer;
  margin-bottom: 2px;
  flex: none;
}
</style>
