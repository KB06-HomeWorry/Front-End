<template>
  <button class="btn-lg-wrapper" @click="$emit('click')">
    <div class="btn-content">
      <img v-if="icon" :src="icon" alt="icon" class="btn-icon" />
      <div class="btn-text-col">
        <span class="btn-text titleBold14px">{{ text }}</span>
        <span class="btn-desc bodyLight12px">{{ desc }}</span>
      </div>
    </div>
  </button>
</template>

<script setup>
const props = defineProps({
  icon: { type: String, default: null },
  text: { type: String, required: true },
  desc: { type: String, required: true },
});
defineEmits(['click']);
</script>

<style scoped>
.btn-lg-wrapper {
  border-radius: 12px;
  width: 360px;
  height: 100px;
  text-align: left;
  padding-left: 21px;
  padding-right: 21px;
  background-color: #fff;
  border: 1px solid var(--color-lightgray);
  color: var(--color-primary);
  transition: all 0.1s;
  cursor: pointer;
  overflow: hidden;
}

.btn-content {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 20px;
}

.btn-icon {
  width: 65px;
  height: 65px;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.10));
}

.btn-text-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.btn-text {
  color: var(--color-primary);
  letter-spacing: -0.03em;
  line-height: 1.34;
  display: block;   
}

.btn-desc {
  color: var(--color-darkgray);
  letter-spacing: -0.03em;
  line-height: 1.34; 
  display: block;
}

.btn-lg-wrapper:hover {
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-05);
}
</style>
