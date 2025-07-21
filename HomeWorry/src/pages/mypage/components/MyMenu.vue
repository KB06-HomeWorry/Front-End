<template>
  <div class="mypage-list-item" @click="$emit('click')">
    <img :src="icon" alt="" class="item-icon" />
    <span class="item-label">{{ label }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: String,
  label: String,
})
</script>

<style scoped>
.mypage-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 0;
  font-size: 16px;
  color: #222;
  border-bottom: 1px solid #ececec;
  cursor: pointer;
  background: transparent;
  transition: background 0.15s;
}
.mypage-list-item:last-child {
  border-bottom: none;
}
.mypage-list-item.disabled {
  color: #bbb;
  cursor: not-allowed;
}
.item-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
}
.item-label {
  flex: 1;
  font-weight: 500;
}
</style>
