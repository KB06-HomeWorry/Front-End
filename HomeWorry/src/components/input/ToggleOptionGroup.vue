<template>
  <div class="input-group">
    <label class="input-label bodyMedium20px">{{ label }}</label>
    <div class="toggle-button-list">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="btn-smslim"
        :class="{
          'selected bodyMedium16px': modelValue.includes(option.value),
          'unselected bodyLight16px': !modelValue.includes(option.value),
        }"
        :style="{
          backgroundColor: modelValue.includes(option.value)
            ? 'var(--color-secondarylight)'
            : 'var(--color-white)',
          color: modelValue.includes(option.value)
            ? 'var(--color-primary)'
            : 'var(--color-light)',
          border: modelValue.includes(option.value)
            ? 'none'
            : '1px solid var(--color-light)',
        }"
        @click="toggle(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
    <div v-if="desc" class="input-desc bodyLight12px">
      {{ desc }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  desc: String,
  options: Array,
  modelValue: Array,
});
const emit = defineEmits(['update:modelValue']);

function toggle(value) {
  const updated = [...props.modelValue];
  const index = updated.indexOf(value);
  if (index === -1) updated.push(value);
  else updated.splice(index, 1);
  emit('update:modelValue', updated);
}
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  color: var(--color-primary);
}

.input-desc {
  letter-spacing: -0.03em;
  color: var(--color-mediumgray);
  margin: 4px 0;
}

.toggle-button-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.btn-smslim {
  border-radius: 12px;
  width: 105px;
  height: 35px;
  text-align: center;
  padding: 0;
  border: none;
}
</style>
