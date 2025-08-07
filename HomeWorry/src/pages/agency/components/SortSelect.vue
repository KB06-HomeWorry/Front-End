<template>
  <div class="sort-select bodyMedium12px">
    <select v-model="selected" @change="onChange">
      <option value="trust">신뢰지수순</option>
      <option value="name">이름순</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  modelValue: {
    type: String,
    default: "trust",
  },
});
const emit = defineEmits(["update:modelValue", "change"]);

const selected = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    selected.value = val;
  }
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
  padding: 0 38px 0 16px; /* 우측 여백 충분히 */
  outline: none;
  cursor: pointer;
  appearance: none; /* 기본 화살표 숨김 */
  background-image: url("@/assets/icons/down_arrow_dark.png");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
}

option {
  font-size: 12px;
  color: var(--color-primary);
  background: #f5f6fa;
}

select:focus {
  border: 1.2px solid var(--color-primary);
}
</style>
