<template>
  <div class="price-box">
    <div class="top-section bodyMedium12px">
      <span class="top-text">{{ location }}</span>
    </div>
    <div class="divider"></div>
    <div class="bottom-section titleBold16px">
      <span class="bottom-text">{{ price }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  location: { type: String, required: true },
  price: { type: String, required: true },
});

defineEmits(['click']);
</script>

<style scoped>
.price-box {
  width: 75px;
  height: 55px;
  border: 1.5px solid var(--color-primary);
  border-radius: 12px 12px 12px 0;
  background: var(--color-white);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.top-section {
  background: var(--color-primary);
  height: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
    padding-top: 3px;       
}

.bottom-section {
  background: var(--color-white);
  height: 60%;
  display: flex;
  align-items: flex-start;  
  justify-content: center;
  padding-top: 6px;       
}

.divider {
  height: 1.5px;
  width: 100%;
  background: var(--color-primary);
  margin: 0;
}

.top-text {
  color: var(--color-white);
}

.bottom-text {
  color: var(--color-primary);
}
</style>
