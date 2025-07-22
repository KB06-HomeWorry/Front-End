<template>
  <div class="mypage-list-item" @click="$emit('click')">
    <img :src="icon" alt="" class="item-icon" />
    <span class="item-label bodyMedium16px" :class="{ 'delete-label':isDelete}">{{ label }}</span>
    <div class="item-divider"></div>
  </div>
</template>

<script setup>
  const props = defineProps({
    icon: String,
    label: String,
    isDelete: Boolean
  })
</script>

<style scoped>
.mypage-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 0;
  cursor: pointer;
  position: relative;
}

.item-icon {
  width: 18px;
  height: 18px;
  margin-left: 2rem;
  object-fit: contain;
}

.item-label {
  color: var(--color-primary);
  line-height: 18px;
  display: flex;
  flex: 1;
  margin-top: 3px;
}

.item-divider {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 360px;
  height: 0;
  border-bottom: 1px solid var(--color-light);
}

.delete-label {
  color: var(--color-light);
  transition: color 0.2s;
}
.mypage-list-item:hover .delete-label {
  color: var(--color-primary);
}
</style>
