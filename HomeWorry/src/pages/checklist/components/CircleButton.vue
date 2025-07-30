<template>
  <button class="circle-btn" @click="$emit('click')">💾</button>
</template>

<script setup>
defineEmits(['click']);
</script>

<style scoped>
.circle-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background-color: #111f5c3a;
  font-size: 24px;
  box-shadow: 0 2px 4cap rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
