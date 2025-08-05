<template>
  <button
    class="btn-med-wrapper bodyMedium12px"
    @click="$emit('click')"
  >
    <p class="text"> {{ text }} </p>
    <img src="@/assets/icons/down_arrow.png" alt="아래 화살표" class="down-arrow" />
  </button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});
defineEmits(['click']);
</script>

<style scoped>
.btn-med-wrapper {
  border-radius: 12px;
  width: auto;
  height: 35px;
  padding: 0 10px;
  border: 1.2px solid var(--color-mediumgray);
  background: #fff;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.text{
    text-align: center;
    color: var(--color-mediumgray);
    line-height: 35px;
    margin-top: 2px;
}

.down-arrow{
    width: 11px;
    height: 11px;
}
</style>