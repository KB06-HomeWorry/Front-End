<template>
  <button class="select-btn">
    <span class="center-text bodyMedium14px">{{ text }}</span>
  </button>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
})
</script>

<style scoped>
.select-btn {
  width: 330px;
  height: 70px;
  background: #fff;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  padding: 0;
}

.center-text {
  color: var(--color-primary);   
  text-align: center;
  line-height: 1;
  letter-spacing: -0.5px;
}
</style>
