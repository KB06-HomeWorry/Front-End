<template>
  <button
    class="listing-btn"
    :class="{ active: visible }"
    @click="toggle"
  >
    {{ visible ? '매물' : '매물' }}
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['toggle']);

function toggle() {
  emit('toggle');
}
</script>

<style scoped>
.listing-btn {
  position: relative;
  top: 60px;
  left: 330px;
  z-index: 10;
  background-color: white;
  color: black;
  border: 1px solid #007BFF;
  padding: 8px 14px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}
.listing-btn.active {
  background-color: #007BFF;
  color: white;
}
</style>