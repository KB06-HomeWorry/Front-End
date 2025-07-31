<template>
  <button class="image-btn">
    <img :src="imgSrc" alt="버튼 이미지" class="center-img" />
  </button>
</template>

<script setup>
defineProps({
  imgSrc: { type: String, required: true },
})
</script>

<style scoped>
.image-btn {
  width: 160px;
  height: 160px;
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

.center-img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  display: block;
  opacity: 0.65;
}
</style>
