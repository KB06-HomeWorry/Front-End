<template>
  <div class="sort-select bodyMedium12px">
    <select v-model="selected" @change="onChange">
      <option
        v-for="opt in normalizedOptions"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "trust" },
  options: {
    type: Array,
    default: () => [
      { value: "trust", label: "신뢰지수순" },
      { value: "name", label: "이름순" },
    ],
  },
});
const emit = defineEmits(["update:modelValue", "change"]);

const selected = ref(props.modelValue);

watch(() => props.modelValue, (val) => { selected.value = val; });

const normalizedOptions = computed(() =>
  props.options.map(o => ({ value: String(o.value), label: String(o.label) }))
);

function onChange() {
  emit("update:modelValue", selected.value);
  emit("change", selected.value);
}
</script>

<style scoped>
.sort-select {
  display: inline-block;
  margin-left: auto;
}

select {
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--color-lightgray);
  background: #fff;
  color: var(--color-primary);
  padding: 0 38px 0 16px;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("@/assets/icons/down_arrow_dark.png");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
}

option {
  color: var(--color-primary);
  background: #f5f6fa;
}

select:focus {
  border: 1.2px solid var(--color-primary);
}
</style>
