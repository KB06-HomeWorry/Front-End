<template>
  <div class="input-field">
    <slot>
      <input
        class="input-box bodyMedium16px"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
        :autocomplete="autocomplete"
      />
    </slot>
  </div>
</template>

<script setup>
const props = defineProps({
  placeholder: String,
  modelValue: String,
  type: { type: String, default: 'text' },
  autocomplete: String,
  disabled: Boolean
});
const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>
.input-field {
  width: 100%;
}

.input-box {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  border: 1px solid var(--color-light);
  padding: 0 16px;
  margin-bottom: 8px;
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

</style>
